const { app, BrowserWindow, ipcMain, dialog, shell, Notification, clipboard } = require('electron');
const fs = require('node:fs/promises');
const fsNative = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn, execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { isRetrySafeStep, validateFlowCollection } = require('./flow-validator');

const execFileAsync = promisify(execFile);
const APP_VERSION = app.getVersion();
let mainWindow;
let runToken = 0;
let activeExecution = false;
const scheduledClosures = new Map();
const triggerTimers = new Map();
const triggerWatches = new Map();
const triggerLastRan = new Map();
const triggerDebounce = new Map();
const activeTriggeredIds = new Set();
let triggerPollTimer = null;
let knownProcesses = new Set();

function getWorkflowDir() { return path.join(app.getPath('userData'), 'workflows'); }
function getHistoryDir() { return path.join(app.getPath('userData'), 'history'); }
function getBackupDir() { return path.join(app.getPath('userData'), 'backups'); }
let debugStepResolver = null;

async function writeJsonAtomic(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  try {
    await fs.writeFile(tempPath, JSON.stringify(value, null, 2), 'utf8');
    await fs.rename(tempPath, filePath);
  } catch (error) {
    await fs.unlink(tempPath).catch(() => {});
    throw error;
  }
}
function makeCancellationError() { const error = new Error('Ausführung abgebrochen.'); error.code = 'FLOW_CANCELLED'; return error; }
function isCancellationError(error, token) { return token !== undefined && token !== runToken || error?.code === 'FLOW_CANCELLED'; }
function safeId(id) { return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(id); }
function safeNumber(value, min, max, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

const ACTION_TYPES = new Set([
  'open-url', 'open-path', 'launch-app', 'copy-text', 'notification', 'wait',
  'close-app', 'window-control', 'switch-window', 'close-app-after-delay',
  'open-mailbox', 'compose-email', 'select-email-account', 'close-mail-client',
  'open-folder', 'file-operation', 'search-files-by-type', 'wait-download-complete',
  'sort-files-by-type', 'open-web-app', 'close-browser-window', 'open-websites',
  'logic-condition', 'set-variable', 'loop-start', 'loop-end', 'run-subflow'
]);
function cleanWorkflow(input) {
  if (!input || typeof input !== 'object') throw new Error('Ungültiger Workflow.');
  const id = safeId(input.id) ? input.id : `flow_${Date.now()}`;
  const name = String(input.name || 'Unbenannter Flow').trim().slice(0, 100) || 'Unbenannter Flow';
  const description = String(input.description || '').trim().slice(0, 240);
  const retryCount = safeNumber(input.retryCount, 0, 3, 1);
  const continueOnError = Boolean(input.continueOnError);
  const rawTrigger = input.trigger && typeof input.trigger === 'object' ? input.trigger : {};
  const triggerType = ['manual', 'interval', 'file-created', 'download-complete', 'process-start'].includes(rawTrigger.type) ? rawTrigger.type : 'manual';
  const trigger = { type: triggerType, intervalMinutes: safeNumber(rawTrigger.intervalMinutes, 5, 1440, 15), folderPath: String(rawTrigger.folderPath || '').slice(0, 4000), pattern: String(rawTrigger.pattern || '*').slice(0, 250), processName: String(rawTrigger.processName || '').slice(0, 150) };
  if (!Array.isArray(input.steps) || input.steps.length > 100) throw new Error('Ein Flow darf maximal 100 Schritte enthalten.');
  const steps = input.steps.map((s, index) => {
    if (!s || !ACTION_TYPES.has(s.type)) throw new Error(`Schritt ${index + 1} hat einen ungültigen Aktionstyp.`);
    const config = s.config && typeof s.config === 'object' ? s.config : {};
    const text = (key, max = 2000) => String(config[key] ?? '').slice(0, max);
    const flag = (key, fallback = false) => config[key] === undefined ? fallback : Boolean(config[key]);
    const base = { id: safeId(s.id) ? s.id : `step_${Date.now()}_${index}`, type: s.type, config: {} };
    switch (s.type) {
      case 'open-url':
      case 'open-web-app':
        base.config = { url: text('url', 1500), appName: text('appName', 120), delaySeconds: safeNumber(config.delaySeconds, 0, 3600, 0), browserPath: text('browserPath', 1500), titleHint: text('titleHint', 150) };
        break;
      case 'open-websites':
        base.config = { urls: text('urls', 15000), delaySeconds: safeNumber(config.delaySeconds, 0, 60, 2), browserPath: text('browserPath', 1500) };
        break;
      case 'open-mailbox':
        base.config = { provider: ['gmail', 'outlook', 'other', 'flow'].includes(config.provider) ? config.provider : 'gmail', accountIndex: safeNumber(config.accountIndex, 0, 9, 0), url: text('url', 1500), browserPath: text('browserPath', 1500), delaySeconds: safeNumber(config.delaySeconds, 0, 3600, 0) };
        break;
      case 'compose-email':
        base.config = { provider: ['gmail', 'outlook', 'mailto', 'flow'].includes(config.provider) ? config.provider : 'gmail', accountIndex: safeNumber(config.accountIndex, 0, 9, 0), recipient: text('recipient', 1000), subject: text('subject', 1000), body: text('body', 8000) };
        break;
      case 'select-email-account':
        base.config = { provider: ['gmail', 'outlook'].includes(config.provider) ? config.provider : 'gmail', accountIndex: safeNumber(config.accountIndex, 0, 9, 0) };
        break;
      case 'open-path':
      case 'open-folder':
        base.config = { path: text('path', 3000) };
        break;
      case 'launch-app':
        base.config = { path: text('path', 3000), closeAfterSeconds: safeNumber(config.closeAfterSeconds, 0, 3600, 0) };
        break;
      case 'close-app':
      case 'close-mail-client':
      case 'close-browser-window':
        const defaultTargetMode = s.type === 'close-mail-client' ? 'title' : s.type === 'close-browser-window' ? 'last-browser' : 'last-launched';
        base.config = { targetMode: ['last-launched', 'last-browser', 'process', 'title'].includes(config.targetMode) ? config.targetMode : defaultTargetMode, target: text('target', 300), processName: text('processName', 200), titleContains: text('titleContains', 200) };
        break;
      case 'window-control':
        base.config = { operation: ['activate', 'minimize', 'maximize', 'restore'].includes(config.operation) ? config.operation : 'activate', targetMode: ['last-launched', 'process', 'title'].includes(config.targetMode) ? config.targetMode : 'title', target: text('target', 300) };
        break;
      case 'close-app-after-delay':
        base.config = { seconds: safeNumber(config.seconds, 1, 3600, 30), targetMode: ['last-launched', 'process', 'title'].includes(config.targetMode) ? config.targetMode : 'last-launched', target: text('target', 300) };
        break;
      case 'switch-window': base.config = {}; break;
      case 'file-operation':
        base.config = { operation: ['create', 'copy', 'move', 'rename'].includes(config.operation) ? config.operation : 'copy', sourcePath: text('sourcePath', 4000), destinationPath: text('destinationPath', 4000), content: text('content', 15000) };
        break;
      case 'search-files-by-type':
        base.config = { folderPath: text('folderPath', 4000), extensions: text('extensions', 500), recursive: flag('recursive', true), copyResults: flag('copyResults', true) };
        break;
      case 'wait-download-complete':
        base.config = { folderPath: text('folderPath', 4000), pattern: text('pattern', 250), timeoutSeconds: safeNumber(config.timeoutSeconds, 1, 3600, 180) };
        break;
      case 'sort-files-by-type':
        base.config = { sourcePath: text('sourcePath', 4000), destinationPath: text('destinationPath', 4000), rules: text('rules', 3000), conflictPolicy: config.conflictPolicy === 'rename' ? 'rename' : 'skip' };
        break;
      case 'copy-text': base.config = { text: text('text', 8000) }; break;
      case 'logic-condition':
        base.config = { conditionSource: ['variable', 'file-exists', 'process-running'].includes(config.conditionSource) ? config.conditionSource : 'variable', variableName: text('variableName', 100), operator: ['equals', 'not-equals', 'contains', 'not-contains', 'greater', 'less', 'truthy', 'falsy'].includes(config.operator) ? config.operator : 'equals', compareValue: text('compareValue', 1000), path: text('path', 4000), processName: text('processName', 150), skipSteps: safeNumber(config.skipSteps, 0, 100, 1) };
        break;
      case 'set-variable':
        base.config = { name: text('name', 100) || 'variable', value: text('value', 4000), valueType: ['text', 'number', 'boolean', 'timestamp'].includes(config.valueType) ? config.valueType : 'text' };
        break;
      case 'loop-start': base.config = { count: safeNumber(config.count, 0, 100, 2) }; break;
      case 'loop-end': base.config = {}; break;
      case 'run-subflow': base.config = { workflowId: text('workflowId', 80) }; break;
      case 'notification': base.config = { title: text('title', 100), message: text('message', 500) }; break;
      case 'wait': base.config = { ms: safeNumber(config.ms, 0, 600000, 1000) }; break;
    }
    return base;
  });
  return { id, name, description, steps, retryCount, continueOnError, trigger, updatedAt: input.updatedAt || new Date().toISOString() };
}

async function validateWorkflowDefinition(raw) {
  let root;
  try { root = cleanWorkflow(raw); }
  catch (error) { return { ok: false, errors: [error.message || 'Invalid workflow.'], warnings: [] }; }
  const allFlows = await listWorkflows().catch(() => []);
  return validateFlowCollection(root, allFlows);
}

async function ensureStore() {
  await fs.mkdir(getWorkflowDir(), { recursive: true });
  const files = (await fs.readdir(getWorkflowDir()).catch(() => [])).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    const first = cleanWorkflow({ id: 'my-first-flow', name: 'My First Flow', description: 'Your first PC automation. Add actions from the catalog to get started.', steps: [] });
    await writeJsonAtomic(path.join(getWorkflowDir(), `${first.id}.json`), first);
    return;
  }
  // Migrate only the untouched starter flow; never rename user-created workflows.
  const starterPath = path.join(getWorkflowDir(), 'my-first-flow.json');
  try {
    const existing = cleanWorkflow(JSON.parse(await fs.readFile(starterPath, 'utf8')));
    if (existing.id === 'my-first-flow' && !existing.steps.length && existing.name === 'Mein erster Flow') {
      existing.name = 'My First Flow';
      existing.description = 'Your first PC automation. Add actions from the catalog to get started.';
      existing.updatedAt = new Date().toISOString();
      await writeJsonAtomic(starterPath, existing);
    }
  } catch {}
}
function sendLog(payload) { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('flow:log', payload); }
async function listWorkflows() {
  await ensureStore();
  const names = (await fs.readdir(getWorkflowDir())).filter((f) => f.endsWith('.json'));
  const workflows = [];
  for (const file of names) {
    try { workflows.push(cleanWorkflow(JSON.parse(await fs.readFile(path.join(getWorkflowDir(), file), 'utf8')))); }
    catch (err) { console.warn(`Workflow konnte nicht geladen werden (${file}):`, err.message); }
  }
  return workflows.sort((a, b) => a.name.localeCompare(b.name, 'de'));
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1480, height: 960, minWidth: 1080, minHeight: 700, title: 'LAPS Flow', backgroundColor: '#0c0e12', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('app:meta', () => ({ version: APP_VERSION, platform: process.platform, userData: app.getPath('userData') }));
ipcMain.handle('workflow:list', () => listWorkflows());
ipcMain.handle('workflow:save', async (_event, raw) => {
  const workflow = cleanWorkflow({ ...raw, updatedAt: new Date().toISOString() });
  await fs.mkdir(getWorkflowDir(), { recursive: true });
  const workflowPath = path.join(getWorkflowDir(), `${workflow.id}.json`);
  let previous = null;
  try { previous = cleanWorkflow(JSON.parse(await fs.readFile(workflowPath, 'utf8'))); } catch {}
  await writeJsonAtomic(workflowPath, workflow);
  // Saving a workflow's steps should not tear down file/process watchers. Refresh only when trigger settings change.
  if (!previous || JSON.stringify(previous.trigger) !== JSON.stringify(workflow.trigger)) await refreshTriggers();
  return workflow;
});
ipcMain.handle('workflow:validate', async (_event, raw) => validateWorkflowDefinition(raw));
ipcMain.handle('workflow:backup', async () => {
  const flows = await listWorkflows();
  await fs.mkdir(getBackupDir(), { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `LAPS-Flow-backup-${stamp}.lapsbackup`;
  const backup = { format: 'laps-flow-backup', version: APP_VERSION, createdAt: new Date().toISOString(), workflows: flows };
  await writeJsonAtomic(path.join(getBackupDir(), fileName), backup);
  return { fileName, count: flows.length };
});
ipcMain.handle('workflow:restore-backup', async () => {
  if (activeExecution) throw new Error('Cannot restore a backup while a workflow is running.');
  const result = await dialog.showOpenDialog(mainWindow, { title: 'Restore LAPS Flow backup', defaultPath: getBackupDir(), properties: ['openFile'], filters: [{ name: 'LAPS Flow backup', extensions: ['lapsbackup'] }] });
  if (result.canceled || !result.filePaths[0]) return { canceled: true };
  const payload = JSON.parse(await fs.readFile(result.filePaths[0], 'utf8'));
  if (payload?.format !== 'laps-flow-backup' || !Array.isArray(payload.workflows) || payload.workflows.length < 1) throw new Error('This is not a valid LAPS Flow backup.');
  const restored = payload.workflows.map((flow) => cleanWorkflow(flow));
  const ids = new Set();
  for (const flow of restored) { if (ids.has(flow.id)) throw new Error('Backup contains duplicate workflow IDs.'); ids.add(flow.id); }
  // Backups may contain unfinished drafts. Preserve them; the Flow Validator blocks
  // invalid workflows at execution time instead of refusing to restore the whole backup.
  // Always back up the current state before replacing it.
  const currentBackup = await (async () => {
    const flows = await listWorkflows();
    await fs.mkdir(getBackupDir(), { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `LAPS-Flow-pre-restore-${stamp}.lapsbackup`;
    await writeJsonAtomic(path.join(getBackupDir(), fileName), { format: 'laps-flow-backup', version: APP_VERSION, createdAt: new Date().toISOString(), workflows: flows });
    return fileName;
  })();
  const userDataDir = app.getPath('userData');
  const workflowDir = getWorkflowDir();
  const stampId = `${Date.now()}-${process.pid}`;
  const stagingDir = path.join(userDataDir, `workflows-restore-staging-${stampId}`);
  const previousDir = path.join(userDataDir, `workflows-pre-restore-${stampId}`);
  let previousMoved = false;
  await fs.rm(stagingDir, { recursive: true, force: true });
  await fs.mkdir(stagingDir, { recursive: true });
  try {
    for (const flow of restored) await writeJsonAtomic(path.join(stagingDir, `${flow.id}.json`), flow);
    await fs.rename(workflowDir, previousDir);
    previousMoved = true;
    try { await fs.rename(stagingDir, workflowDir); }
    catch (error) {
      await fs.rename(previousDir, workflowDir).catch((restoreError) => console.error('Failed to roll back backup restore:', restoreError));
      previousMoved = false;
      throw error;
    }
    previousMoved = false;
    await fs.rm(previousDir, { recursive: true, force: true }).catch(() => {});
  } catch (error) {
    await fs.rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    if (previousMoved) await fs.rename(previousDir, workflowDir).catch((restoreError) => console.error('Failed to roll back backup restore:', restoreError));
    throw error;
  }
  await refreshTriggers();
  return { canceled: false, count: restored.length, backupFileName: path.basename(result.filePaths[0]), safetyBackup: currentBackup };
});
ipcMain.handle('app:close-after-save', async () => {
  const deadline = Date.now() + 10000;
  while (activeExecution && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 50));
  if (activeExecution) throw new Error('The workflow is still stopping. Keep LAPS Flow open and try closing again.');
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
  return true;
});
ipcMain.handle('workflow:delete', async (_event, id) => {
  if (!safeId(id)) throw new Error('Ungültige Flow-ID.');
  await fs.unlink(path.join(getWorkflowDir(), `${id}.json`));
  await refreshTriggers();
  const remaining = await listWorkflows();
  if (remaining.length === 0) await ensureStore();
  return { ok: true };
});
ipcMain.handle('dialog:save-file-path', async (_event, options = {}) => {
  const result = await dialog.showSaveDialog(mainWindow, { title: options.title || 'Zieldatei auswählen', defaultPath: options.defaultPath || 'Neue-Datei.txt' });
  return result.canceled ? null : result.filePath || null;
});
ipcMain.handle('dialog:select-path', async (_event, options = {}) => {
  const properties = options.foldersOnly ? ['openDirectory'] : options.filesOnly ? ['openFile'] : ['openFile', 'openDirectory'];
  const result = await dialog.showOpenDialog(mainWindow, {
    title: options.title || 'Pfad auswählen', properties,
    filters: options.exeOnly ? [{ name: 'Windows-Anwendungen', extensions: ['exe'] }] : undefined
  });
  return result.canceled ? null : result.filePaths[0] || null;
});
ipcMain.handle('workflow:export', async (_event, raw) => {
  const workflow = cleanWorkflow(raw);
  const result = await dialog.showSaveDialog(mainWindow, { title: 'Flow exportieren', defaultPath: `${workflow.name.replace(/[^\p{L}\p{N}_-]+/gu, '-')}.lapsflow.json`, filters: [{ name: 'LAPS Flow', extensions: ['json', 'lapsflow'] }] });
  if (result.canceled || !result.filePath) return { canceled: true };
  await fs.writeFile(result.filePath, JSON.stringify(workflow, null, 2), 'utf8');
  return { canceled: false, filePath: result.filePath };
});
ipcMain.handle('workflow:import', async () => {
  const result = await dialog.showOpenDialog(mainWindow, { title: 'Flow importieren', properties: ['openFile'], filters: [{ name: 'LAPS Flow JSON', extensions: ['json', 'lapsflow'] }] });
  if (result.canceled || !result.filePaths[0]) return null;
  const raw = JSON.parse(await fs.readFile(result.filePaths[0], 'utf8'));
  const workflow = cleanWorkflow({ ...raw, id: `flow_${Date.now()}`, updatedAt: new Date().toISOString() });
  await writeJsonAtomic(path.join(getWorkflowDir(), `${workflow.id}.json`), workflow);
  await refreshTriggers();
  return workflow;
});
ipcMain.handle('system:open-external', async (_event, value) => { await openUrlSafely(value); return true; });
ipcMain.handle('system:list-windows', async () => listWindows());
ipcMain.handle('history:list', async () => listHistory());
ipcMain.handle('history:get', async (_event, id) => getHistoryRecord(id));
ipcMain.handle('history:clear', async () => {
  if (activeExecution) throw new Error('Cannot clear execution history while a flow is running.');
  await fs.mkdir(getHistoryDir(), { recursive: true });
  const files = (await fs.readdir(getHistoryDir()).catch(() => [])).filter((name) => name.endsWith('.json'));
  await Promise.all(files.map((name) => fs.unlink(path.join(getHistoryDir(), name)).catch(() => {})));
  return { ok: true, count: files.length };
});
ipcMain.handle('history:rerun-from-step', async (_event, payload) => rerunFromHistoryStep(payload));

async function saveHistoryRecord(record) {
  await fs.mkdir(getHistoryDir(), { recursive: true });
  await writeJsonAtomic(path.join(getHistoryDir(), `${record.id}.json`), record);
  const files = (await fs.readdir(getHistoryDir()).catch(() => [])).filter((name) => name.endsWith('.json'));
  const sorted = await Promise.all(files.map(async (name) => ({ name, mtime: (await fs.stat(path.join(getHistoryDir(), name)).catch(() => ({ mtimeMs: 0 }))).mtimeMs })));
  sorted.sort((a, b) => b.mtime - a.mtime);
  await Promise.all(sorted.slice(60).map((item) => fs.unlink(path.join(getHistoryDir(), item.name)).catch(() => {})));
}
async function listHistory() {
  await fs.mkdir(getHistoryDir(), { recursive: true });
  const files = (await fs.readdir(getHistoryDir()).catch(() => [])).filter((name) => name.endsWith('.json'));
  const records = [];
  for (const name of files) {
    try {
      const record = JSON.parse(await fs.readFile(path.join(getHistoryDir(), name), 'utf8'));
      records.push({ id: record.id, workflowId: record.workflowId, workflowName: record.workflowName, status: record.status, startedAt: record.startedAt, endedAt: record.endedAt, durationMs: record.durationMs, triggered: Boolean(record.triggered), stepCount: (record.steps || []).length, error: record.error || '', failedStepIndex: record.failedStepIndex ?? null });
    } catch {}
  }
  return records.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 60);
}
async function getHistoryRecord(id) {
  if (!safeId(id)) throw new Error('Ungültige Ausführungs-ID.');
  try { return JSON.parse(await fs.readFile(path.join(getHistoryDir(), `${id}.json`), 'utf8')); }
  catch { throw new Error('Diese Ausführung ist nicht mehr vorhanden.'); }
}
async function rerunFromHistoryStep(payload = {}) {
  const record = await getHistoryRecord(String(payload.runId || ''));
  const index = Number(payload.index);
  if (!Number.isInteger(index) || index < 0 || index >= (record.workflowSnapshot?.steps || []).length) throw new Error('Ungültiger Schritt für die Fortsetzung.');
  const snapshot = JSON.parse(JSON.stringify(record.workflowSnapshot));
  const failedStep = snapshot.steps[index];
  snapshot.id = `resume_${Date.now()}`;
  snapshot.name = `${String(record.workflowName || snapshot.name).slice(0, 80)} – Fortsetzung`;
  snapshot.steps = snapshot.steps.slice(index);
  snapshot.trigger = { type: 'manual', intervalMinutes: 15, folderPath: '', pattern: '*', processName: '' };
  return executeWorkflow(snapshot, { initialVariables: record.steps?.find((step) => step.stepId === failedStep.id && step.workflowId === record.workflowId)?.variablesBefore || {}, resumedFrom: { runId: record.id, stepId: failedStep.id } });
}

async function recoverInterruptedHistory() {
  await fs.mkdir(getHistoryDir(), { recursive: true });
  const names = (await fs.readdir(getHistoryDir()).catch(() => [])).filter((name) => name.endsWith('.json'));
  for (const name of names) {
    const filePath = path.join(getHistoryDir(), name);
    try {
      const record = JSON.parse(await fs.readFile(filePath, 'utf8'));
      if (record.status !== 'running') continue;
      record.status = 'interrupted';
      record.endedAt = new Date().toISOString();
      record.durationMs = Math.max(0, Date.now() - new Date(record.startedAt || Date.now()).getTime());
      record.error = 'The app closed before this run finished. Steps already completed may have changed files or opened programs.';
      await writeJsonAtomic(filePath, record);
    } catch (error) { console.warn(`Could not recover history ${name}:`, error.message); }
  }
}

function stopTriggerResources() {
  for (const timer of triggerTimers.values()) clearInterval(timer);
  triggerTimers.clear();
  for (const watcher of triggerWatches.values()) { try { watcher.close(); } catch {} }
  triggerWatches.clear();
  for (const timer of triggerDebounce.values()) clearTimeout(timer);
  triggerDebounce.clear();
  if (triggerPollTimer) clearInterval(triggerPollTimer);
  triggerPollTimer = null;
}
async function runTriggeredWorkflow(workflow, label, eventData = {}) {
  if (activeExecution || activeTriggeredIds.has(workflow.id)) {
    sendLog({ runId: 'triggers', kind: 'warning', message: `Trigger „${label}“ für „${workflow.name}“ übersprungen: Ein anderer Flow läuft bereits.`, at: Date.now() });
    return;
  }
  activeTriggeredIds.add(workflow.id);
  try {
    // Event watchers may live longer than a workflow edit. Always execute the latest saved steps.
    const latest = (await listWorkflows()).find((candidate) => candidate.id === workflow.id) || workflow;
    sendLog({ runId: 'triggers', kind: 'info', message: `Lokaler Trigger ausgelöst: ${label} → ${latest.name}`, at: Date.now() });
    await executeWorkflow(latest, { triggered: true, initialVariables: { 'trigger.source': label, 'trigger.fileName': eventData.fileName || '', 'trigger.path': eventData.filePath || '', 'trigger.processName': eventData.processName || '', 'trigger.processId': eventData.processId || '' } });
  } finally { activeTriggeredIds.delete(workflow.id); }
}
async function refreshTriggers() {
  stopTriggerResources();
  let all = [];
  try { all = await listWorkflows(); } catch { return; }
  let needsProcessPoll = false;
  for (const workflow of all) {
    const trigger = workflow.trigger || { type: 'manual' };
    if (trigger.type === 'manual') continue;
    if (trigger.type === 'interval') {
      if (!triggerLastRan.has(workflow.id)) triggerLastRan.set(workflow.id, Date.now());
      const timer = setInterval(async () => {
        const last = triggerLastRan.get(workflow.id) || Date.now();
        if (Date.now() - last < trigger.intervalMinutes * 60000) return;
        triggerLastRan.set(workflow.id, Date.now());
        await runTriggeredWorkflow(workflow, `Intervall alle ${trigger.intervalMinutes} Minuten`);
      }, 5000);
      triggerTimers.set(workflow.id, timer);
    }
    if (trigger.type === 'file-created' || trigger.type === 'download-complete') {
      const folder = path.resolve(String(trigger.folderPath || path.join(os.homedir(), 'Downloads')));
      try {
        const stat = await fs.stat(folder);
        if (!stat.isDirectory()) throw new Error('kein Ordner');
        const watcher = fsNative.watch(folder, { persistent: true }, (_event, rawName) => {
          const fileName = rawName ? String(rawName) : '';
          if (!fileName || !patternRegex(trigger.pattern || '*').test(fileName)) return;
          if (trigger.type === 'download-complete' && /\.(crdownload|part|tmp|download)$/i.test(fileName)) return;
          const key = `${workflow.id}:${fileName}`;
          if (triggerDebounce.has(key)) clearTimeout(triggerDebounce.get(key));
          const timer = setTimeout(async () => {
            triggerDebounce.delete(key);
            const fullPath = path.join(folder, fileName);
            try { if (!(await fs.stat(fullPath)).isFile()) return; } catch { return; }
            if (trigger.type === 'download-complete') {
              let previous = -1, stable = 0;
              for (let attempt = 0; attempt < 20 && stable < 3; attempt++) {
                await delay(700);
                try {
                  const size = (await fs.stat(fullPath)).size;
                  stable = size === previous ? stable + 1 : 0; previous = size;
                } catch { return; }
              }
              if (stable < 3) return;
            }
            await runTriggeredWorkflow(workflow, `${trigger.type === 'file-created' ? 'Neue Datei' : 'Download abgeschlossen'}: ${fileName}`, { fileName, filePath: fullPath });
          }, trigger.type === 'download-complete' ? 900 : 350);
          triggerDebounce.set(key, timer);
        });
        watcher.on('error', (err) => sendLog({ runId: 'triggers', kind: 'warning', message: `Datei-Trigger für „${workflow.name}“ gestoppt: ${err.message}`, at: Date.now() }));
        triggerWatches.set(workflow.id, watcher);
      } catch (err) {
        sendLog({ runId: 'triggers', kind: 'warning', message: `Datei-Trigger für „${workflow.name}“ nicht aktiv: Ordner fehlt oder ist nicht zugänglich (${folder}).`, at: Date.now() });
      }
    }
    if (trigger.type === 'process-start') needsProcessPoll = true;
  }
  if (needsProcessPoll) {
    try { knownProcesses = new Set((await listWindows()).filter((w) => w.pid).map((w) => `${String(w.processName || '').toLowerCase()}:${w.pid}`)); } catch { knownProcesses = new Set(); }
    triggerPollTimer = setInterval(async () => {
      try {
        const windows = await listWindows();
        const currentProcesses = new Set(windows.filter((w) => w.pid).map((w) => `${String(w.processName || '').toLowerCase()}:${w.pid}`));
        for (const workflow of all.filter((flow) => flow.trigger?.type === 'process-start')) {
          const expected = String(workflow.trigger.processName || '').toLowerCase().replace(/\.exe$/i, '');
          if (!expected) continue;
          const newlyStarted = windows.find((w) => w.pid && String(w.processName || '').toLowerCase() === expected && !knownProcesses.has(`${String(w.processName || '').toLowerCase()}:${w.pid}`));
          if (newlyStarted) await runTriggeredWorkflow(workflow, `Programm gestartet: ${newlyStarted.processName}`, { processName: newlyStarted.processName, processId: newlyStarted.pid });
        }
        knownProcesses = currentProcesses;
      } catch (err) { sendLog({ runId: 'triggers', kind: 'warning', message: `Windows-Prozessüberwachung: ${err.message}`, at: Date.now() }); }
    }, 12000);
  }
}

async function openUrlSafely(value) {
  const parsed = new URL(String(value));
  if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) throw new Error('Nur HTTP-, HTTPS- und mailto-Links sind erlaubt.');
  if (parsed.protocol === 'mailto:') await shell.openExternal(parsed.toString());
  else await shell.openExternal(parsed.toString());
}
function delay(ms, token = null) {
  const duration = Math.max(0, Number.isFinite(Number(ms)) ? Number(ms) : 0);
  if (token === null || token === undefined) return new Promise((resolve) => setTimeout(resolve, duration));
  return new Promise((resolve, reject) => {
    if (token !== runToken) { reject(makeCancellationError()); return; }
    const started = Date.now();
    const timer = setInterval(() => {
      if (token !== runToken) { clearInterval(timer); reject(makeCancellationError()); return; }
      if (Date.now() - started >= duration) { clearInterval(timer); resolve(); }
    }, Math.min(100, Math.max(10, duration)));
  });
}
function waitForDebugContinue(token, nextIndex, total, stepType, variables = {}) {
  if (token !== runToken) return Promise.resolve(false);
  const variableSnapshot = Object.fromEntries(Object.entries(variables || {}).slice(0, 50).map(([key, value]) => [String(key).slice(0, 100), typeof value === 'string' ? value.slice(0, 500) : value]));
  sendLog({ kind: 'debug-pause', runId: token, stepIndex: nextIndex, stepCount: total, stepType, variables: variableSnapshot, message: `Debug pause before step ${nextIndex + 1}/${total}: ${stepType}`, at: Date.now() });
  return new Promise((resolve) => {
    let settled = false;
    const finish = (shouldContinue) => {
      if (settled) return; settled = true; clearInterval(poll);
      if (debugStepResolver === continueDebug) debugStepResolver = null;
      resolve(Boolean(shouldContinue) && token === runToken);
    };
    const continueDebug = (shouldContinue = true) => finish(shouldContinue);
    debugStepResolver = continueDebug;
    const poll = setInterval(() => { if (token !== runToken) finish(false); }, 100);
  });
}
function fileExists(p) { return fs.access(p).then(() => true, () => false); }
function patternRegex(pattern = '*') {
  const escaped = String(pattern).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}
async function walkFiles(folder, recursive, max = 10000) {
  const results = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (results.length >= max) return;
      const full = path.join(dir, entry.name);
      if (entry.isFile()) results.push(full);
      else if (recursive && entry.isDirectory()) await walk(full);
    }
  }
  await walk(folder);
  return results;
}
async function moveFile(source, destination) {
  try { await fs.rename(source, destination); }
  catch (err) {
    if (err.code !== 'EXDEV') throw err;
    await fs.copyFile(source, destination, fs.constants.COPYFILE_EXCL);
    await fs.unlink(source);
  }
}

// Native Windows window control. Parameters are sent as base64 JSON, never interpolated into PowerShell expressions.
const WINDOWS_NATIVE_SOURCE = String.raw`
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
public class LapsWindowInfo {
  public long Handle { get; set; }
  public int ProcessId { get; set; }
  public string ProcessName { get; set; }
  public string Title { get; set; }
  public bool Visible { get; set; }
}
public static class LapsNative {
  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc callback, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int command);
  [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr hWnd, uint message, IntPtr wParam, IntPtr lParam);
  public static List<LapsWindowInfo> GetWindows() {
    var output = new List<LapsWindowInfo>();
    EnumWindows(delegate(IntPtr hwnd, IntPtr param) {
      int length = 1024;
      StringBuilder text = new StringBuilder(length);
      GetWindowText(hwnd, text, length);
      uint pid;
      GetWindowThreadProcessId(hwnd, out pid);
      string processName = "";
      try { processName = Process.GetProcessById((int)pid).ProcessName; } catch {}
      output.Add(new LapsWindowInfo { Handle = hwnd.ToInt64(), ProcessId = (int)pid, ProcessName = processName, Title = text.ToString(), Visible = IsWindowVisible(hwnd) });
      return true;
    }, IntPtr.Zero);
    return output;
  }
  public static bool Act(long handle, string operation) {
    IntPtr hwnd = new IntPtr(handle);
    if (operation == "minimize") { ShowWindow(hwnd, 6); return true; }
    if (operation == "maximize") { ShowWindow(hwnd, 3); return true; }
    if (operation == "restore") { ShowWindow(hwnd, 9); return true; }
    if (operation == "activate") { ShowWindow(hwnd, 9); return SetForegroundWindow(hwnd); }
    if (operation == "close") return PostMessage(hwnd, 0x0010, IntPtr.Zero, IntPtr.Zero);
    return false;
  }
  public static bool SwitchNext() {
    var windows = GetWindows().FindAll(w => w.Visible && !String.IsNullOrWhiteSpace(w.Title) && !w.ProcessName.ToLowerInvariant().Replace(" ", "").Contains("lapsflow") && !w.ProcessName.ToLowerInvariant().Equals("electron"));
    if (windows.Count < 2) return false;
    long active = GetForegroundWindow().ToInt64();
    int index = windows.FindIndex(w => w.Handle == active);
    int next = index < 0 ? 0 : (index + 1) % windows.Count;
    return Act(windows[next].Handle, "activate");
  }
}`;

function encodedPowerShell(script) { return Buffer.from(script, 'utf16le').toString('base64'); }
async function invokeWindowsPowerShell(payload, body) {
  if (process.platform !== 'win32') throw new Error('Diese Aktion benötigt Windows.');
  const payloadBase64 = Buffer.from(JSON.stringify(payload || {}), 'utf8').toString('base64');
  const script = `$ErrorActionPreference = 'Stop'\n$payloadJson = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${payloadBase64}'))\n$cfg = ConvertFrom-Json -InputObject $payloadJson\nAdd-Type -TypeDefinition @'\n${WINDOWS_NATIVE_SOURCE}\n'@\n${body}\n`;
  const result = await execFileAsync('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', encodedPowerShell(script)], { windowsHide: true, timeout: 20000, maxBuffer: 5 * 1024 * 1024 });
  const raw = String(result.stdout || '').trim();
  if (!raw) return '';
  try { return Buffer.from(raw, 'base64').toString('utf8'); } catch { return raw; }
}
async function listWindows() {
  if (process.platform !== 'win32') return [];
  const output = await invokeWindowsPowerShell({}, `\n$all = [LapsNative]::GetWindows() | Where-Object { $_.Visible -and -not [string]::IsNullOrWhiteSpace($_.Title) } | ForEach-Object { [pscustomobject]@{ handle = [long]$_.Handle; pid = [int]$_.ProcessId; processName = [string]$_.ProcessName; title = [string]$_.Title } }\n$json = ConvertTo-Json -InputObject @($all) -Compress
[Console]::Write([Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($json)))`);
  if (!output) return [];
  try { const parsed = JSON.parse(output); return Array.isArray(parsed) ? parsed : [parsed]; }
  catch { throw new Error('Fensterliste konnte nicht gelesen werden.'); }
}
async function nativeWindowAction({ operation, targetType, target }) {
  const output = await invokeWindowsPowerShell({ operation, targetType, target: String(target ?? '') }, `\nif ($cfg.operation -eq 'switch-next') { $ok = [LapsNative]::SwitchNext(); $json = ConvertTo-Json -InputObject @{ count = [int]$ok; ok = $ok } -Compress; [Console]::Write([Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($json))); exit }\n$windows = [LapsNative]::GetWindows() | Where-Object { $_.Visible -and -not [string]::IsNullOrWhiteSpace($_.Title) }\n$matches = @($windows | Where-Object {\n  if ($cfg.targetType -eq 'handle') { return ([string]$_.Handle -eq [string]$cfg.target) }\n  if ($cfg.targetType -eq 'pid') { return ([int]$_.ProcessId -eq [int]$cfg.target) }\n  if ($cfg.targetType -eq 'process') { return ([string]$_.ProcessName -ieq [string]$cfg.target -or [string]$_.ProcessName -ieq ([System.IO.Path]::GetFileNameWithoutExtension([string]$cfg.target))) }\n  if ($cfg.targetType -eq 'title') { return $_.Title.IndexOf([string]$cfg.target, [System.StringComparison]::OrdinalIgnoreCase) -ge 0 }\n  return $false\n})\n$chosen = if ($cfg.targetType -eq 'title') { @($matches | Select-Object -First 1) } else { $matches }\n$count = 0\nforeach ($w in $chosen) { if ([LapsNative]::Act([long]$w.Handle, [string]$cfg.operation)) { $count++ } }\n$json = ConvertTo-Json -InputObject @{ count = $count; windows = @($chosen | ForEach-Object { [pscustomobject]@{ handle=$_.Handle; pid=$_.ProcessId; processName=$_.ProcessName; title=$_.Title } }) } -Compress
[Console]::Write([Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($json)))`);
  try { return JSON.parse(output || '{}'); } catch { throw new Error('Windows-Aktion konnte nicht ausgewertet werden.'); }
}

function targetForConfiguredMode(config, context, forBrowser = false) {
  const mode = config.targetMode || (forBrowser ? 'last-browser' : 'last-launched');
  if (mode === 'last-launched') {
    const record = context.startedApps[context.startedApps.length - 1];
    if (!record) throw new Error('Dieser Flow hat bisher keine App gestartet. Füge zuerst „App starten“ hinzu oder wähle einen Prozess/ein Fenster.');
    return record.windowHandle ? { targetType: 'handle', target: String(record.windowHandle) } : { targetType: 'pid', target: String(record.pid) };
  }
  if (mode === 'last-browser') {
    if (context.lastBrowserWindowHandle) return { targetType: 'handle', target: String(context.lastBrowserWindowHandle) };
    const titleTarget = config.target || context.lastBrowserTitle;
    if (titleTarget) return { targetType: 'title', target: titleTarget };
    throw new Error('Kein vom Flow identifiziertes Browserfenster. Gib einen Fenstertitel ein oder öffne die Website mit einem ausgewählten Browserprogramm.');
  }
  if (mode === 'process') {
    const target = config.target || config.processName;
    if (!target) throw new Error('Bitte einen Prozessnamen eingeben, z. B. notepad oder OUTLOOK.');
    return { targetType: 'process', target };
  }
  const title = config.target || config.titleContains;
  if (!title) throw new Error('Bitte einen Teil des Fenstertitels eingeben.');
  return { targetType: 'title', target: title };
}
async function closeTarget(config, context) {
  const target = targetForConfiguredMode(config, context, config.targetMode === 'last-browser');
  const result = await nativeWindowAction({ operation: 'close', ...target });
  if (!result.count) throw new Error('Es wurde kein passendes Fenster gefunden. Prüfe den Prozessnamen oder Fenstertitel.');
  sendLog({ kind: 'info', message: `${result.count} Fenster zum normalen Schließen aufgefordert.`, at: Date.now() });
  return result.count;
}
async function waitForNewWindow(beforeHandles, preferredProcessName = '', timeoutMs = 4500, token = null) {
  if (process.platform !== 'win32') return null;
  const deadline = Date.now() + timeoutMs;
  const preferred = String(preferredProcessName || '').toLowerCase().replace(/\.exe$/i, '');
  while (Date.now() < deadline) {
    await delay(350, token);
    const windows = await listWindows();
    const fresh = windows.filter((w) => !beforeHandles.has(String(w.handle)));
    const matched = preferred ? fresh.find((w) => String(w.processName || '').toLowerCase() === preferred) : null;
    if (matched || fresh.length) return matched || fresh[0];
  }
  return null;
}
async function spawnApp(target, args = []) {
  const child = spawn(target, args, { detached: true, stdio: 'ignore', windowsHide: false, shell: false });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Zeitüberschreitung beim Start der Anwendung.')), 12000);
    child.once('error', (err) => { clearTimeout(timer); reject(new Error(`Anwendung konnte nicht gestartet werden: ${err.message}`)); });
    child.once('spawn', () => { clearTimeout(timer); resolve(); });
  });
  child.unref();
  return { pid: child.pid, path: target };
}
async function launchBrowserUrl(url, browserPath, context, titleHint = '', token = null) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Webadressen müssen mit http:// oder https:// beginnen.');
  context.lastBrowserTitle = titleHint || (parsed.hostname.includes('gmail') ? 'Gmail' : parsed.hostname.includes('outlook') ? 'Outlook' : parsed.hostname);
  if (!browserPath.trim()) { context.lastBrowserWindowHandle = null; await shell.openExternal(parsed.toString()); return; }
  const before = new Set((await listWindows()).map((w) => String(w.handle)));
  const launched = await spawnApp(browserPath.trim(), ['--new-window', parsed.toString()]);
  context.lastBrowserProcess = { ...launched, processName: path.basename(browserPath, path.extname(browserPath)) };
  const until = Date.now() + 9000;
  while (Date.now() < until) {
    await delay(450, token);
    const after = await listWindows();
    const fresh = after.find((w) => !before.has(String(w.handle)) && (w.title || '').trim());
    if (fresh) { context.lastBrowserWindowHandle = fresh.handle; context.lastBrowserWindowHandles.push(fresh.handle); context.lastBrowserTitle = fresh.title || context.lastBrowserTitle; break; }
  }
}

async function runFileOperation(config) {
  const operation = config.operation;
  const source = String(config.sourcePath || '').trim();
  const destination = String(config.destinationPath || '').trim();
  if (operation === 'create') {
    if (!source) throw new Error('Gib den vollständigen neuen Dateipfad ein.');
    await fs.mkdir(path.dirname(source), { recursive: true });
    await fs.writeFile(source, config.content || '', { encoding: 'utf8', flag: 'wx' });
    return `Datei erstellt: ${source}`;
  }
  if (!source || !destination) throw new Error('Quell- und Zielpfad müssen ausgefüllt sein.');
  if (operation === 'copy') {
    await fs.copyFile(source, destination, fs.constants.COPYFILE_EXCL);
    return `Datei kopiert: ${source} → ${destination}`;
  }
  if (operation === 'move') {
    if (await fileExists(destination)) throw new Error('Die Zieldatei existiert bereits. Wähle einen anderen Namen.');
    await moveFile(source, destination);
    return `Datei verschoben: ${source} → ${destination}`;
  }
  if (operation === 'rename') {
    if (await fileExists(destination)) throw new Error('Der neue Dateiname existiert bereits.');
    await fs.rename(source, destination);
    return `Datei umbenannt: ${source} → ${destination}`;
  }
  throw new Error('Unbekannte Dateioperation.');
}

async function runSearchFiles(config) {
  const folder = String(config.folderPath || '').trim();
  if (!folder) throw new Error('Bitte einen Suchordner auswählen.');
  const exts = String(config.extensions || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean).map((e) => e.startsWith('.') ? e : `.${e}`);
  if (!exts.length) throw new Error('Gib mindestens eine Dateiendung ein, z. B. .pdf,.docx.');
  const files = await walkFiles(folder, Boolean(config.recursive), 10000);
  const matches = files.filter((file) => exts.includes(path.extname(file).toLowerCase())).slice(0, 500);
  if (config.copyResults && matches.length) clipboard.writeText(matches.join('\r\n'));
  sendLog({ kind: 'info', message: `Dateisuche: ${matches.length} Treffer für ${exts.join(', ')}${config.copyResults && matches.length ? ' (Pfade in Zwischenablage kopiert)' : ''}.`, at: Date.now() });
  matches.slice(0, 8).forEach((file) => sendLog({ kind: 'info', message: file, at: Date.now() }));
  if (!matches.length) sendLog({ kind: 'warning', message: 'Keine passenden Dateien gefunden.', at: Date.now() });
  return `${matches.length} passende Datei(en) gefunden.`;
}

async function waitForDownload(config, token, flowStartedAt) {
  const folder = String(config.folderPath || path.join(os.homedir(), 'Downloads')).trim();
  const pattern = patternRegex(config.pattern || '*');
  const timeoutMs = safeNumber(config.timeoutSeconds, 1, 3600, 180) * 1000;
  const started = Date.now();
  const stable = new Map();
  while (Date.now() - started < timeoutMs) {
    if (token !== runToken) throw new Error('Ausführung abgebrochen.');
    const names = await fs.readdir(folder).catch((err) => { throw new Error(`Download-Ordner kann nicht gelesen werden: ${err.message}`); });
    for (const name of names) {
      if (!pattern.test(name) || /\.(crdownload|part|download|tmp)$/i.test(name)) continue;
      const full = path.join(folder, name);
      const stat = await fs.stat(full).catch(() => null);
      if (!stat || !stat.isFile()) continue;
      if (typeof flowStartedAt === 'number' && stat.mtimeMs < flowStartedAt - 1000) continue;
      const previous = stable.get(full);
      const checks = previous && previous.size === stat.size ? previous.checks + 1 : 0;
      stable.set(full, { size: stat.size, checks });
      if (checks >= 2) return `Download abgeschlossen: ${name}`;
    }
    await delay(1000, token);
  }
  throw new Error(`Zeitüberschreitung: Keine abgeschlossene Datei (${config.pattern || '*'}) innerhalb von ${config.timeoutSeconds} Sekunden erkannt.`);
}

async function sortFilesByType(config) {
  const source = String(config.sourcePath || '').trim();
  const destination = String(config.destinationPath || '').trim();
  if (!source || !destination) throw new Error('Quell- und Zielordner auswählen.');
  const rules = [];
  for (const line of String(config.rules || '').split(/\r?\n/)) {
    const split = line.split('=');
    if (split.length < 2) continue;
    const extensions = split[0].split(',').map((e) => e.trim().toLowerCase()).filter(Boolean).map((e) => e.startsWith('.') ? e : `.${e}`);
    const folderName = split.slice(1).join('=').trim();
    if (!extensions.length || !folderName || folderName === '.' || folderName === '..' || folderName.includes('/') || folderName.includes('\\')) continue;
    rules.push({ extensions, folderName });
  }
  if (!rules.length) throw new Error('Gib Regeln im Format „.pdf=PDFs“ ein.');
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  let moved = 0; let skipped = 0;
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const rule = rules.find((item) => item.extensions.includes(path.extname(entry.name).toLowerCase()));
    if (!rule) continue;
    const from = path.join(source, entry.name);
    const targetDir = path.join(destination, rule.folderName);
    await fs.mkdir(targetDir, { recursive: true });
    let to = path.join(targetDir, entry.name);
    if (await fileExists(to)) {
      if (config.conflictPolicy !== 'rename') { skipped++; continue; }
      const ext = path.extname(entry.name); const stem = path.basename(entry.name, ext);
      let i = 1;
      do { to = path.join(targetDir, `${stem} (${i++})${ext}`); } while (await fileExists(to) && i < 10000);
    }
    await moveFile(from, to); moved++;
  }
  return `${moved} Datei(en) sortiert, ${skipped} wegen Namenskonflikt(en) übersprungen.`;
}

function resolveVariables(value, variables) {
  if (typeof value === 'string') return value.replace(/\$\{([a-zA-Z0-9_.-]+)\}/g, (_match, key) => String(variables?.[key] ?? ''));
  if (Array.isArray(value)) return value.map((item) => resolveVariables(item, variables));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveVariables(item, variables)]));
  return value;
}
function findMatchingLoopEnd(steps, startIndex) {
  let depth = 0;
  for (let i = startIndex + 1; i < steps.length; i++) {
    if (steps[i].type === 'loop-start') depth++;
    if (steps[i].type === 'loop-end') {
      if (depth === 0) return i;
      depth--;
    }
  }
  return -1;
}
async function evaluateCondition(config, context) {
  let left;
  if (config.conditionSource === 'file-exists') {
    left = Boolean(String(config.path || '').trim()) && await fileExists(String(config.path || '').trim());
  } else if (config.conditionSource === 'process-running') {
    const expected = String(config.processName || '').toLowerCase().replace(/\.exe$/i, '');
    if (!expected) return false;
    const windows = await listWindows();
    left = windows.some((window) => String(window.processName || '').toLowerCase() === expected);
  } else {
    left = context.variables[String(config.variableName || '')];
  }
  const right = config.compareValue ?? '';
  const leftText = String(left ?? '');
  const rightText = String(right ?? '');
  const leftNumber = Number(left), rightNumber = Number(right);
  switch (config.operator) {
    case 'not-equals': return leftText !== rightText;
    case 'contains': return leftText.toLocaleLowerCase().includes(rightText.toLocaleLowerCase());
    case 'not-contains': return !leftText.toLocaleLowerCase().includes(rightText.toLocaleLowerCase());
    case 'greater': return Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber > rightNumber;
    case 'less': return Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber < rightNumber;
    case 'truthy': return Boolean(left) && leftText !== 'false' && leftText !== '0';
    case 'falsy': return !left || leftText === 'false' || leftText === '0';
    case 'equals': default: return leftText === rightText;
  }
}

async function executeWorkflow(raw, options = {}) {
  const workflow = cleanWorkflow(raw);
  const internal = Boolean(options.internal);
  if (!internal && activeExecution) return { ok: false, error: 'Ein anderer Flow läuft bereits. Warte, bis er abgeschlossen ist.' };
  if (!internal) activeExecution = true;
  const token = options.token ?? ++runToken;
  if (!internal) {
    let validation;
    try { validation = await validateWorkflowDefinition(workflow); }
    catch (error) {
      activeExecution = false;
      const message = `Flow validation failed: ${error.message}`;
      sendLog({ runId: token, kind: 'error', message, at: Date.now() });
      sendLog({ runId: token, kind: 'finish', message: 'Flow was not started because validation failed.', at: Date.now() });
      return { ok: false, error: message };
    }
    if (token !== runToken) {
      activeExecution = false;
      sendLog({ runId: token, kind: 'info', cancelled: true, message: 'Flow cancelled before it started.', at: Date.now() });
      sendLog({ runId: token, kind: 'finish', cancelled: true, message: 'Flow cancelled.', at: Date.now() });
      return { ok: false, cancelled: true, error: 'Flow cancelled.' };
    }
    if (!validation.ok) {
      activeExecution = false;
      const error = validation.errors.join('\n');
      sendLog({ runId: token, kind: 'error', message: `Flow validation failed: ${validation.errors[0] || 'Invalid workflow'}`, at: Date.now() });
      sendLog({ runId: token, kind: 'finish', message: 'Flow wurde wegen Validierungsfehlern nicht gestartet.', at: Date.now() });
      return { ok: false, error, validation };
    }
  }
  const flowStartedAt = options.flowStartedAt || Date.now();
  const context = options.context || { startedApps: [], lastBrowserWindowHandle: null, lastBrowserWindowHandles: [], lastBrowserTitle: '', emailAccount: { provider: 'gmail', accountIndex: 0 }, variables: { ...(options.initialVariables || {}) } };
  if (!context.variables) context.variables = { ...(options.initialVariables || {}) };
  const record = options.record || (!internal ? { id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, workflowId: workflow.id, workflowName: workflow.name, status: 'running', startedAt: new Date().toISOString(), endedAt: null, durationMs: 0, triggered: Boolean(options.triggered), resumedFrom: options.resumedFrom || null, workflowSnapshot: workflow, steps: [], error: '', failedStepIndex: null } : null);
  if (!internal) sendLog({ runId: token, kind: 'start', debug: Boolean(options.debug), message: `Flow „${workflow.name}“ ${options.triggered ? 'automatisch ' : ''}gestartet${options.debug ? ' (Debug-Modus)' : ''}.`, at: Date.now() });
  let currentRootStepIndex = null;
  try {
    // Include history I/O in the execution guard so a full disk or permission error cannot leave the runner stuck.
    if (record) await saveHistoryRecord(record);
    if (!workflow.steps.length) {
      sendLog({ runId: token, kind: 'info', message: 'Dieser Flow enthält noch keine Aktionen.', at: Date.now() });
      if (!internal) sendLog({ runId: token, kind: 'finish', message: 'Nichts auszuführen.', at: Date.now() });
      if (record && !internal) { record.status = 'success'; record.endedAt = new Date().toISOString(); record.durationMs = 0; await saveHistoryRecord(record); }
      return { ok: true, empty: true };
    }
    const loopStack = [];
    let interpretedSteps = 0;
    for (let i = 0; i < workflow.steps.length; i++) {
      if (token !== runToken) throw makeCancellationError();
      if (options.debug && i > 0) {
        const shouldContinue = await waitForDebugContinue(token, i, workflow.steps.length, workflow.steps[i]?.type || 'unknown', context.variables);
        if (!shouldContinue) throw makeCancellationError();
      }
      if (++interpretedSteps > 1000) throw new Error('Sicherheitslimit: Dieser Flow hat mehr als 1.000 interpretierten Schritte ausgeführt. Prüfe Bedingungen und Schleifen.');
      const stepIndex = i;
      const step = workflow.steps[i]; const c = resolveVariables(step.config, context.variables);
      if (!internal) currentRootStepIndex = stepIndex;
      const stepRecord = record ? { stepId: step.id, workflowId: workflow.id, workflowName: workflow.name, index: stepIndex, type: step.type, input: { config: c }, output: '', status: 'running', error: '', attempts: 0, variablesBefore: { ...context.variables }, startedAt: new Date().toISOString(), endedAt: null } : null;
      if (record && stepRecord) { record.steps.push(stepRecord); await saveHistoryRecord(record); }
      sendLog({ runId: token, kind: 'step-start', stepId: step.id, index: stepIndex, message: `Schritt ${stepIndex + 1}/${workflow.steps.length}: ${step.type}`, at: Date.now() });
      let message = '';
      let stepError = null;
      const retrySafe = isRetrySafeStep(step, c);
      const maxAttempts = retrySafe ? workflow.retryCount + 1 : 1;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (token !== runToken) throw makeCancellationError();
        if (stepRecord) stepRecord.attempts = attempt + 1;
        if (attempt > 0) sendLog({ runId: token, kind: 'warning', stepId: step.id, index: stepIndex, message: `Wiederholungsversuch ${attempt}/${workflow.retryCount} für Schritt ${stepIndex + 1}.`, at: Date.now() });
        try {
          message = '';
          switch (step.type) {
        case 'open-url':
        case 'open-web-app': {
          if (!String(c.url || '').trim()) throw new Error('Bitte eine Webadresse eintragen.');
          if (c.delaySeconds) await delay(c.delaySeconds * 1000, token);
          const targetUrl = new URL(c.url);
          if (!['http:', 'https:'].includes(targetUrl.protocol)) throw new Error('Nur HTTP- und HTTPS-Webadressen sind erlaubt.');
          await launchBrowserUrl(targetUrl.toString(), c.browserPath || '', context, c.titleHint || c.appName || targetUrl.hostname, token);
          message = `${step.type === 'open-web-app' ? 'Web-App' : 'Website'} geöffnet: ${c.url}`;
          break;
        }
        case 'open-websites': {
          const urls = String(c.urls || '').split(/\r?\n/).map((u) => u.trim()).filter(Boolean);
          if (!urls.length) throw new Error('Füge mindestens eine URL ein (eine pro Zeile).');
          for (let u = 0; u < urls.length; u++) {
            if (token !== runToken) throw new Error('Ausführung abgebrochen.');
            await launchBrowserUrl(urls[u], c.browserPath || '', context, new URL(urls[u]).hostname, token);
            if (u < urls.length - 1 && c.delaySeconds) await delay(c.delaySeconds * 1000, token);
          }
          message = `${urls.length} Website(s) geöffnet.`;
          break;
        }
        case 'open-mailbox': {
          const provider = c.provider === 'flow' ? context.emailAccount.provider : c.provider;
          const accountIndex = c.provider === 'flow' ? context.emailAccount.accountIndex : c.accountIndex;
          if (provider === 'gmail' || provider === 'outlook') context.emailAccount = { provider, accountIndex };
          let url = '';
          if (provider === 'gmail') { url = `https://mail.google.com/mail/u/${accountIndex}/#inbox`; context.lastBrowserTitle = 'Gmail'; }
          else if (provider === 'outlook') { url = 'https://outlook.office.com/mail/'; context.lastBrowserTitle = 'Outlook'; }
          else { url = String(c.url || '').trim(); if (!url) throw new Error('Für ein anderes Postfach eine vollständige URL eintragen.'); context.lastBrowserTitle = new URL(url).hostname; }
          if (c.delaySeconds) await delay(c.delaySeconds * 1000, token);
          await launchBrowserUrl(url, c.browserPath || '', context, context.lastBrowserTitle, token);
          message = `Postfach geöffnet (${provider}${provider === 'gmail' ? `, Konto ${accountIndex + 1}` : ''}).`;
          break;
        }
        case 'compose-email': {
          const provider = c.provider === 'flow' ? context.emailAccount.provider : (c.provider || context.emailAccount.provider);
          const accountIndex = c.provider === 'flow' ? context.emailAccount.accountIndex : safeNumber(c.accountIndex, 0, 9, context.emailAccount.accountIndex);
          const mailParams = provider === 'gmail'
            ? new URLSearchParams({ to: c.recipient || '', su: c.subject || '', body: c.body || '' })
            : new URLSearchParams({ to: c.recipient || '', subject: c.subject || '', body: c.body || '' });
          let url;
          if (provider === 'gmail') url = `https://mail.google.com/mail/u/${accountIndex}/?view=cm&fs=1&${mailParams.toString()}`;
          else if (provider === 'outlook') url = `https://outlook.office.com/mail/deeplink/compose?${mailParams.toString()}`;
          else url = `mailto:${encodeURIComponent(c.recipient || '')}?subject=${encodeURIComponent(c.subject || '')}&body=${encodeURIComponent(c.body || '')}`;
          context.lastBrowserTitle = provider === 'gmail' ? 'Gmail' : provider === 'outlook' ? 'Outlook' : 'Mail';
          if (url.startsWith('http://') || url.startsWith('https://')) await launchBrowserUrl(url, '', context, context.lastBrowserTitle, token);
          else await openUrlSafely(url);
          message = 'E-Mail-Entwurf vorbereitet. Die Nachricht wurde nicht versendet.';
          break;
        }
        case 'select-email-account':
          context.emailAccount = { provider: c.provider, accountIndex: c.accountIndex };
          message = c.provider === 'gmail' ? `Gmail-Konto ${c.accountIndex + 1} für nachfolgende Mail-Aktionen ausgewählt.` : 'Outlook für nachfolgende Mail-Aktionen ausgewählt; das aktive Microsoft-Webkonto wird verwendet.';
          break;
        case 'launch-app': {
          const target = String(c.path || '').trim();
          if (!target) throw new Error('Bitte den Pfad zu einer Anwendung auswählen.');
          const before = new Set((await listWindows()).map((w) => String(w.handle)));
          const launched = await spawnApp(target);
          const processName = path.basename(target, path.extname(target));
          const newWindow = await waitForNewWindow(before, processName, 4500, token);
          const launchedRecord = { ...launched, processName, windowHandle: newWindow?.handle || null, windowTitle: newWindow?.title || '' };
          context.startedApps.push(launchedRecord);
          message = `Anwendung gestartet: ${target}${newWindow ? ` (Fenster erkannt: ${newWindow.title})` : ''}`;
          if (c.closeAfterSeconds > 0) scheduleWindowClose(newWindow ? { targetType: 'handle', target: String(newWindow.handle) } : { targetType: 'pid', target: String(launched.pid) }, c.closeAfterSeconds, token, target);
          break;
        }
        case 'close-app':
        case 'close-mail-client':
        case 'close-browser-window': {
          const conf = { ...c };
          if (step.type === 'close-mail-client' && !conf.target && !conf.titleContains) { conf.targetMode = 'title'; conf.target = 'Gmail'; }
          if (step.type === 'close-browser-window' && !conf.targetMode) conf.targetMode = 'last-browser';
          let count = 0;
          if (step.type === 'close-browser-window' && (conf.targetMode || 'last-browser') === 'last-browser' && context.lastBrowserWindowHandles.length) {
            for (const handle of [...context.lastBrowserWindowHandles].reverse()) {
              const result = await nativeWindowAction({ operation: 'close', targetType: 'handle', target: String(handle) });
              count += result.count || 0;
            }
            context.lastBrowserWindowHandles = []; context.lastBrowserWindowHandle = null;
          } else { count = await closeTarget(conf, context); }
          if (!count) throw new Error('Es wurde kein passendes Fenster gefunden. Prüfe den Fenstertitel oder wähle einen Browser-Pfad, damit Flow das geöffnete Fenster verfolgen kann.');
          message = `${count} Fenster zum Schließen aufgefordert.`;
          break;
        }
        case 'close-app-after-delay': {
          const target = targetForConfiguredMode(c, context);
          scheduleWindowClose(target, c.seconds, token, 'App');
          message = `Schließen in ${c.seconds} Sekunde(n) vorgemerkt.`;
          break;
        }
        case 'window-control': {
          const target = targetForConfiguredMode(c, context);
          const result = await nativeWindowAction({ operation: c.operation, ...target });
          if (!result.count) throw new Error('Kein passendes Programmfenster gefunden. Prüfe Prozessname/Fenstertitel.');
          message = `Fensteraktion „${c.operation}“ ausgeführt.`;
          break;
        }
        case 'switch-window': {
          const result = await nativeWindowAction({ operation: 'switch-next', targetType: 'all', target: '' });
          if (!result.count) throw new Error('Es wurde kein weiteres sichtbares Programmfenster gefunden.');
          message = 'Zum nächsten geöffneten Programm gewechselt.';
          break;
        }
        case 'open-path':
        case 'open-folder': {
          const target = String(c.path || '').trim();
          if (!target) throw new Error('Bitte einen Datei- oder Ordnerpfad eintragen.');
          const openError = await shell.openPath(target);
          if (openError) throw new Error(openError);
          message = `Pfad geöffnet: ${target}`;
          break;
        }
        case 'file-operation': message = await runFileOperation(c); break;
        case 'search-files-by-type': message = await runSearchFiles(c); break;
        case 'wait-download-complete': message = await waitForDownload(c, token, flowStartedAt); break;
        case 'sort-files-by-type': message = await sortFilesByType(c); break;
        case 'copy-text': clipboard.writeText(c.text || ''); message = 'Text in die Zwischenablage kopiert.'; break;
        case 'notification':
          if (Notification.isSupported()) new Notification({ title: c.title || 'LAPS Flow', body: c.message || 'Workflow-Aktion abgeschlossen.' }).show();
          else sendLog({ runId: token, kind: 'warning', message: 'Windows-Benachrichtigungen werden auf diesem System nicht unterstützt.', at: Date.now() });
          message = 'Benachrichtigung angezeigt.';
          break;
        case 'set-variable': {
          const variableName = String(c.name || '').trim();
          if (!/^[a-zA-Z_][a-zA-Z0-9_.-]{0,99}$/.test(variableName)) throw new Error('Variablenname ungültig: Verwende Buchstaben, Ziffern, Punkt, _ oder -; der Name darf nicht mit einer Zahl beginnen.');
          let value = c.value;
          if (c.valueType === 'number') { value = Number(value); if (!Number.isFinite(value)) throw new Error('Der Variablenwert ist keine gültige Zahl.'); }
          else if (c.valueType === 'boolean') value = ['true', '1', 'ja', 'yes'].includes(String(value).toLowerCase());
          else if (c.valueType === 'timestamp') value = new Date().toISOString();
          context.variables[variableName] = value;
          message = `Variable „${variableName}“ gesetzt.`;
          break;
        }
        case 'logic-condition': {
          const passed = await evaluateCondition(c, context);
          message = `Bedingung ${passed ? 'erfüllt' : 'nicht erfüllt'}.`;
          if (!passed && Number(c.skipSteps) > 0) i += Math.min(100, Number(c.skipSteps));
          break;
        }
        case 'loop-start': {
          const endIndex = findMatchingLoopEnd(workflow.steps, stepIndex);
          if (endIndex < 0) throw new Error('Für „Schleife starten“ fehlt ein passender „Schleife beenden“-Baustein.');
          const count = safeNumber(c.count, 0, 100, 2);
          if (count <= 0) { i = endIndex; message = 'Schleife mit 0 Wiederholungen übersprungen.'; }
          else { loopStack.push({ startIndex: stepIndex, endIndex, remaining: count }); message = `Schleife gestartet (${count} Durchlauf/Durchläufe).`; }
          break;
        }
        case 'loop-end': {
          const loop = loopStack[loopStack.length - 1];
          if (!loop || loop.endIndex !== stepIndex) throw new Error('„Schleife beenden“ hat keinen passenden Schleifenanfang.');
          if (loop.remaining > 1) { loop.remaining--; i = loop.startIndex; message = `Schleife wiederholt; ${loop.remaining} Durchlauf/Durchläufe verbleiben.`; }
          else { loopStack.pop(); message = 'Schleife abgeschlossen.'; }
          break;
        }
        case 'run-subflow': {
          if ((options.depth || 0) >= 5) throw new Error('Unter-Flows dürfen maximal 5 Ebenen tief verschachtelt werden.');
          const workflowId = String(c.workflowId || '').trim();
          if (!safeId(workflowId)) throw new Error('Wähle einen gespeicherten Unter-Flow aus.');
          if (workflowId === workflow.id) throw new Error('Ein Flow kann sich nicht selbst als Unter-Flow aufrufen.');
          const target = (await listWorkflows()).find((candidate) => candidate.id === workflowId);
          if (!target) throw new Error('Der ausgewählte Unter-Flow wurde nicht gefunden.');
          const result = await executeWorkflow(target, { internal: true, token, flowStartedAt, context, depth: (options.depth || 0) + 1, record, debug: Boolean(options.debug) });
          if (!result.ok) throw new Error(result.error || 'Der Unter-Flow ist fehlgeschlagen.');
          message = `Unter-Flow „${target.name}“ abgeschlossen.`;
          break;
        }
        case 'wait': await delay(safeNumber(c.ms, 0, 600000, 0), token); message = `Wartezeit von ${c.ms} ms abgeschlossen.`; break;
        default: throw new Error('Unbekannte Aktion.');
          }
          if (token !== runToken) throw makeCancellationError();
          stepError = null;
          break;
        } catch (err) {
          stepError = err;
          if (token !== runToken || err?.code === 'FLOW_CANCELLED') break;
          if (attempt + 1 < maxAttempts) await delay(Math.min(1500 * (attempt + 1), 4500), token);
        }
      }
      if (token !== runToken || stepError?.code === 'FLOW_CANCELLED') throw makeCancellationError();
      if (stepError && !retrySafe && workflow.retryCount > 0) {
        sendLog({ runId: token, kind: 'warning', stepId: step.id, index: stepIndex, message: `Automatic retry skipped for ${step.type} to avoid repeating a possible side effect.`, at: Date.now() });
      }
      if (stepError) {
        if (workflow.continueOnError) {
          if (stepRecord) { stepRecord.status = 'error-continued'; stepRecord.error = stepError.message; stepRecord.output = ''; stepRecord.endedAt = new Date().toISOString(); await saveHistoryRecord(record); }
          const attemptsMade = stepRecord?.attempts || 1;
          sendLog({ runId: token, kind: 'warning', stepId: step.id, index: stepIndex, message: `Schritt ${stepIndex + 1} nach ${attemptsMade} Versuch(en) übersprungen: ${stepError.message}`, at: Date.now() });
          continue;
        }
        if (stepRecord) { stepRecord.status = 'error'; stepRecord.error = stepError.message; stepRecord.endedAt = new Date().toISOString(); await saveHistoryRecord(record); }
        throw stepError;
      }
      if (stepRecord) { stepRecord.status = 'success'; stepRecord.output = message || `Schritt ${stepIndex + 1} abgeschlossen.`; stepRecord.endedAt = new Date().toISOString(); await saveHistoryRecord(record); }
      sendLog({ runId: token, kind: 'step-done', stepId: step.id, index: stepIndex, message: message || `Schritt ${stepIndex + 1} abgeschlossen.`, at: Date.now() });
    }
    if (record && !internal) { record.status = 'success'; record.endedAt = new Date().toISOString(); record.durationMs = Date.now() - new Date(record.startedAt).getTime(); record.error = ''; await saveHistoryRecord(record); }
    if (!internal) sendLog({ runId: token, kind: 'finish', message: 'Alle Aktionen wurden abgeschlossen. Geplante App-Schließungen laufen weiter.', at: Date.now() });
    return { ok: true };
  } catch (error) {
    const cancelled = isCancellationError(error, token);
    if (record && !internal) {
      record.status = cancelled ? 'cancelled' : 'error';
      record.endedAt = new Date().toISOString();
      record.durationMs = Date.now() - new Date(record.startedAt).getTime();
      record.error = cancelled ? 'Run cancelled by the user.' : (error.message || 'Unbekannter Fehler');
      record.failedStepIndex = currentRootStepIndex;
      try { await saveHistoryRecord(record); }
      catch (historyError) { console.warn('Unable to persist failed run history:', historyError.message); }
    }
    if (internal) throw error;
    if (cancelled) {
      sendLog({ runId: token, kind: 'info', message: 'Flow abgebrochen. Bereits ausgeführte externe Aktionen werden nicht rückgängig gemacht.', at: Date.now() });
      sendLog({ runId: token, kind: 'finish', cancelled: true, message: 'Flow abgebrochen.', at: Date.now() });
      return { ok: false, cancelled: true, error: 'Flow cancelled.' };
    }
    sendLog({ runId: token, kind: 'error', message: error.message || 'Unbekannter Fehler', at: Date.now() });
    sendLog({ runId: token, kind: 'finish', message: 'Flow mit Fehler beendet.', at: Date.now() });
    return { ok: false, error: error.message || 'Unbekannter Fehler' };
  } finally {
    if (!internal) activeExecution = false;
  }
}
function scheduleWindowClose(target, seconds, token, label) {
  const ms = safeNumber(seconds, 1, 3600, 30) * 1000;
  const timer = setTimeout(async () => {
    scheduledClosures.delete(timer);
    try {
      const result = await nativeWindowAction({ operation: 'close', ...target });
      sendLog({ runId: token, kind: result.count ? 'info' : 'warning', message: result.count ? `${label} nach ${Math.round(ms / 1000)} Sekunde(n) zum normalen Schließen aufgefordert.` : `${label}: Nach Ablauf wurde kein passendes Fenster gefunden.`, at: Date.now() });
    } catch (err) { sendLog({ runId: token, kind: 'error', message: `Geplantes Schließen fehlgeschlagen: ${err.message}`, at: Date.now() }); }
  }, ms);
  scheduledClosures.set(timer, { target, token });
}

ipcMain.handle('workflow:run', (_event, raw, options = {}) => executeWorkflow(raw, options || {}));
ipcMain.handle('workflow:debug-continue', () => { if (!debugStepResolver) return false; const resume = debugStepResolver; debugStepResolver = null; resume(true); return true; });
ipcMain.handle('workflow:cancel', () => {
  runToken++;
  if (debugStepResolver) { const resume = debugStepResolver; debugStepResolver = null; resume(false); }
  for (const [timer, details] of scheduledClosures) {
    if (details.token !== runToken) { clearTimeout(timer); scheduledClosures.delete(timer); }
  }
  sendLog({ kind: 'info', message: 'Abbruch angefordert. Bereits gestartete externe Programme werden nicht automatisch beendet.', at: Date.now() });
  return true;
});

app.whenReady().then(async () => {
  await ensureStore();
  await recoverInterruptedHistory();
  createWindow();
  await refreshTriggers();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('before-quit', () => stopTriggerResources());
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
