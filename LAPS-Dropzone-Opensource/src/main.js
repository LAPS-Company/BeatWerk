'use strict';

const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { uniquePaths, makeNonClashingPath, basenameSafe } = require('./core');
const { inspectInputPaths } = require('./folder-scan');

const APP_ID = 'com.laps.dropzone';
const MAX_COLLECTION_ITEMS = 25000;
const MAX_TRANSFER_ITEMS = MAX_COLLECTION_ITEMS;
const appRoot = __dirname;
let mainWindow;
let isQuitting = false;

app.setAppUserModelId(APP_ID);

function isTrustedSender(event) {
  try {
    const senderUrl = event.senderFrame?.url || event.sender?.getURL?.() || '';
    return senderUrl === pathToFileURL(path.join(appRoot, 'index.html')).href;
  } catch {
    return false;
  }
}

function handle(channel, callback) {
  ipcMain.handle(channel, async (event, ...args) => {
    if (!isTrustedSender(event)) throw new Error('Untrusted IPC sender.');
    return callback(...args);
  });
}

function assertStringsArray(value, max = MAX_COLLECTION_ITEMS) {
  if (!Array.isArray(value) || value.length > max || value.some((x) => typeof x !== 'string' || x.length > 32768)) {
    throw new Error('Invalid file list.');
  }
  return uniquePaths(value);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1370,
    height: 900,
    minWidth: 900,
    minHeight: 640,
    title: 'LAPS Dropzone',
    icon: path.join(appRoot, '..', 'assets', 'dropzone.ico'),
    backgroundColor: '#f4f7fc',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(appRoot, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) shell.openExternal(url).catch(() => {});
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== pathToFileURL(path.join(appRoot, 'index.html')).href) event.preventDefault();
  });
  mainWindow.loadFile(path.join(appRoot, 'index.html'));
}

function getStatePath() {
  return path.join(app.getPath('userData'), 'collection-state.json');
}

async function describePath(filePath) {
  const safePath = path.resolve(filePath);
  const name = basenameSafe(safePath);
  try {
    const stat = await fsp.stat(safePath);
    if (!stat.isFile()) return null;
    return {
      path: safePath,
      name,
      directory: path.dirname(safePath),
      extension: path.extname(name).slice(1).toUpperCase() || 'FILE',
      size: stat.size,
      modifiedAt: stat.mtimeMs,
      exists: true
    };
  } catch {
    return {
      path: safePath,
      name,
      directory: path.dirname(safePath),
      extension: path.extname(name).slice(1).toUpperCase() || 'FILE',
      size: 0,
      modifiedAt: 0,
      exists: false
    };
  }
}

async function chooseFiles() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Add files to Dropzone',
    properties: ['openFile', 'multiSelections']
  });
  if (result.canceled) return { paths: [], canceled: true };
  return { paths: result.filePaths, canceled: false };
}

async function chooseFolder() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Add a folder to Dropzone',
    properties: ['openDirectory']
  });
  if (result.canceled || !result.filePaths[0]) return { paths: [], canceled: true };
  // Return the directory itself. The inspector keeps it as a folder entry and separately scans children.
  return { paths: result.filePaths, canceled: false };
}

async function chooseDestination() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose destination folder',
    properties: ['openDirectory', 'createDirectory']
  });
  return result.canceled || !result.filePaths[0] ? null : result.filePaths[0];
}

async function saveCollection(payload) {
  // Version 1.0.0 previously saved a flat array of file paths. Accept it for compatibility,
  // but write the new grouped collection shape for folders + files.
  const files = Array.isArray(payload) ? assertStringsArray(payload) : assertStringsArray(payload?.files || []);
  const folders = Array.isArray(payload) ? [] : assertStringsArray(payload?.folders || [], 1000);
  if (folders.some((folderPath) => !path.isAbsolute(folderPath))) throw new Error('Invalid folder path in collection.');
  const target = getStatePath();
  await fsp.mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.tmp`;
  await fsp.writeFile(temp, JSON.stringify({ version: 2, files, folders }, null, 2), 'utf8');
  await fsp.rename(temp, target);
  return { saved: files.length, folders: folders.length };
}

async function loadCollection() {
  try {
    const raw = await fsp.readFile(getStatePath(), 'utf8');
    const saved = JSON.parse(raw);
    const files = assertStringsArray(Array.isArray(saved) ? saved : (saved?.files || saved?.paths || []));
    const folders = Array.isArray(saved) ? [] : assertStringsArray(saved?.folders || [], 1000);
    return { files, folders };
  } catch {
    return { files: [], folders: [] };
  }
}

async function describeFolder(folderPath) {
  const safePath = path.resolve(folderPath);
  let exists = false;
  try { exists = (await fsp.stat(safePath)).isDirectory(); } catch {}
  return { path: safePath, name: basenameSafe(safePath), directory: path.dirname(safePath), exists };
}

function fileExists(candidate) {
  try { fs.accessSync(candidate); return true; } catch { return false; }
}

function samePath(a, b) {
  const left = path.resolve(a);
  const right = path.resolve(b);
  return process.platform === 'win32' ? left.toLowerCase() === right.toLowerCase() : left === right;
}

async function transferFiles(paths, destination, mode, conflictMode) {
  const safePaths = assertStringsArray(paths, MAX_TRANSFER_ITEMS);
  if (typeof destination !== 'string' || !path.isAbsolute(destination)) throw new Error('Choose a valid destination folder.');
  if (!['copy', 'move'].includes(mode)) throw new Error('Unknown transfer operation.');
  if (!['rename', 'skip'].includes(conflictMode)) throw new Error('Unknown conflict policy.');
  const destStat = await fsp.stat(destination).catch(() => null);
  if (!destStat?.isDirectory()) throw new Error('The destination folder no longer exists.');

  const results = [];
  for (const source of safePaths) {
    const name = basenameSafe(source);
    try {
      const sourceStat = await fsp.stat(source);
      if (!sourceStat.isFile()) {
        results.push({ path: source, name, status: 'skipped', message: 'Not a regular file.' });
        continue;
      }
      let target = path.join(destination, name);
      if (samePath(source, target)) {
        results.push({ path: source, name, status: 'skipped', message: 'File is already in the destination.' });
        continue;
      }
      if (fileExists(target)) {
        if (conflictMode === 'skip') {
          results.push({ path: source, name, status: 'skipped', message: 'A file with this name already exists.' });
          continue;
        }
        target = makeNonClashingPath(destination, name, fileExists);
      }
      if (mode === 'copy') {
        await fsp.copyFile(source, target, fs.constants.COPYFILE_EXCL);
        await fsp.utimes(target, sourceStat.atime, sourceStat.mtime).catch(() => {});
      } else {
        try {
          await fsp.rename(source, target);
        } catch (error) {
          if (error.code !== 'EXDEV') throw error;
          await fsp.copyFile(source, target, fs.constants.COPYFILE_EXCL);
          await fsp.utimes(target, sourceStat.atime, sourceStat.mtime).catch(() => {});
          await fsp.unlink(source);
        }
      }
      results.push({ path: source, destinationPath: target, name, status: 'success', message: mode === 'copy' ? 'Copied successfully.' : 'Moved successfully.' });
    } catch (error) {
      results.push({ path: source, name, status: 'error', message: error?.message || 'Transfer failed.' });
    }
  }
  return {
    results,
    success: results.filter((r) => r.status === 'success').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length
  };
}

handle('dialog:pick-files', chooseFiles);
handle('dialog:pick-folder', chooseFolder);
handle('files:inspect-inputs', async (paths) => {
  const safePaths = assertStringsArray(paths, 1000);
  // Only accept absolute local paths supplied by a native file picker or the OS drag surface.
  const absolutePaths = safePaths.filter((item) => path.isAbsolute(item));
  return inspectInputPaths(absolutePaths, MAX_COLLECTION_ITEMS);
});
handle('files:expand-dropped-paths', async (paths) => {
  // Backwards-compatible alias; callers now receive folder roots as well as scanned file paths.
  const safePaths = assertStringsArray(paths, 1000);
  return inspectInputPaths(safePaths.filter((item) => path.isAbsolute(item)), MAX_COLLECTION_ITEMS);
});
handle('dialog:pick-destination', chooseDestination);
handle('files:describe', async (paths) => {
  const safePaths = assertStringsArray(paths);
  const entries = await Promise.all(safePaths.map(describePath));
  return entries.filter(Boolean);
});
handle('folders:describe', async (paths) => {
  const safePaths = assertStringsArray(paths, 1000);
  return Promise.all(safePaths.map(describeFolder));
});
handle('collection:load', loadCollection);
handle('collection:save', saveCollection);
handle('files:transfer', transferFiles);
handle('manifest:export', async (paths) => {
  const safePaths = assertStringsArray(paths);
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export collection list',
    defaultPath: 'laps-dropzone-collection.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  const entries = await Promise.all(safePaths.map(describePath));
  await fsp.writeFile(result.filePath, JSON.stringify({ app: 'LAPS Dropzone', exportedAt: new Date().toISOString(), files: entries.filter(Boolean) }, null, 2), 'utf8');
  return { canceled: false, path: result.filePath };
});
handle('app:open-external', async (url) => {
  if (typeof url !== 'string' || !/^https:\/\//i.test(url)) throw new Error('Only HTTPS links can be opened.');
  await shell.openExternal(url);
  return { opened: true };
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => { isQuitting = true; });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' || isQuitting) app.quit();
});
