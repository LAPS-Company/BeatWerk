'use strict';

const api = window.dropzoneAPI;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const translations = {
  en: {
    localOnly: 'Files stay on your device', kicker: 'YOUR FILE STAGING AREA', headline: 'Gather files. Move as one.',
    subheadline: 'Collect files from different places, then copy or move them together — without jumping between folders.',
    dropTitle: 'Drop files here', dropDesc: 'Or add them from different folders. Nothing is moved until you choose an action.', addFiles: 'Add files', addFolder: 'Add folder', dropNow: 'Drop to add to your collection',
    collectionLabel: 'COLLECTION', yourFiles: 'Your files', exportList: 'Export list', clearAll: 'Clear all', searchPlaceholder: 'Search your collection…',
    fileHeader: 'FILE', locationHeader: 'LOCATION', sizeHeader: 'SIZE', statusHeader: 'STATUS', emptyTitle: 'Your dropzone is empty',
    emptyDesc: 'Add files from anywhere on your PC. They’ll collect here until you’re ready.', browseFiles: 'Browse files', savedLocally: 'Your collection is saved locally and restored next time.',
    transferLabel: 'NEXT STEP', transferFiles: 'Transfer files', transferDesc: 'Choose where your selected files should go.', destinationLabel: 'DESTINATION FOLDER', noDestination: 'No destination selected', destinationHelp: 'Choose a folder to continue',
    actionLabel: 'ACTION', copyFiles: 'Copy files', moveFiles: 'Move files', ifExists: 'IF A FILE ALREADY EXISTS', renameConflict: 'Keep both (rename incoming file)',
    skipConflict: 'Skip the incoming file', selectedToTransfer: 'Selected to transfer', selectedSize: 'Total size', safeNote: 'Files are only changed when you press the action button. Existing files are never overwritten.',
    copySelected: 'Copy selected files', moveSelected: 'Move selected files', selectHint: 'Select files and choose a destination first.', destinationNeeded: 'Choose a destination folder first.',
    chooseFilesFirst: 'Add or select at least one file first.', activityLabel: 'RECENT ACTIVITY', lastTransfer: 'Last transfer', footerLocal: 'Local-first. Your files stay on your PC.', about: 'About LAPS',
    cancel: 'Cancel', confirm: 'Confirm', clearTitle: 'Clear this collection?', clearMessage: 'This removes the files from the Dropzone list. Your original files will not be deleted.',
    moveTitle: 'Move selected files?', moveMessage: 'Moving removes successful files from their original locations. This action cannot be automatically undone.',
    removeTitle: 'Remove this file?', removeMessage: 'This removes the item from your Dropzone list only. The original file stays where it is.',
    clearConfirm: 'Clear collection', moveConfirm: 'Move files', removeConfirm: 'Remove file', noMatchTitle: 'No matching files', noMatchDesc: 'Try another search, or add more files.',
    missing: 'Missing', ready: 'Ready', saving: 'Saving…', saved: 'Saved', saveFailed: 'Could not save collection', noFiles: 'No files', oneFile: '1 file', files: 'files', selected: 'selected',
    addSuccess: 'Added {count} file(s) to your collection.', addNothing: 'No new files were added.', tooManyFolder: 'The folder contains more than the scan limit. Only the first files were added.',
    transferComplete: 'Transfer complete: {success} succeeded, {skipped} skipped, {errors} failed.', transferFailed: 'Transfer failed: {message}', destinationSelected: 'Destination selected',
    working: 'Working…', copyAction: 'Copy selected files', moveAction: 'Move selected files', noDestinationAction: 'Choose destination',
    activitySuccess: 'Completed', activitySkipped: 'Skipped', activityError: 'Failed', copied: 'Copied', moved: 'Moved',
    manifestSaved: 'Collection list exported.', aboutTitle: 'About LAPS Dropzone', aboutMessage: 'LAPS Dropzone is a local-first file staging tool by LAPS. Your files are handled on your device; the app does not upload them.',
    openWebsite: 'Open LAPS website', close: 'Close', folderScan: 'Scanning folder…', confirmButton: 'Continue',
    sameLocation: 'File is already in the destination.', existing: 'A file with this name already exists.', operationCopy: 'Copy', operationMove: 'Move',
    sourceDirectory: 'Source folder', viewCollection: 'Collection', selectVisible: 'Select visible files', removeFile: 'Remove file',
    droppedFolderNotSupported: 'The dropped item could not be read. Try Add folder to select it directly.', folderEmpty: 'No files were found in that folder.', folderUnreadable: 'The folder could not be read. Check its permissions and try Add folder.', totalSelected: '{count} selected', nothingToExport: 'Add files before exporting the list.', folder: 'Folder', folderFiles: '{count} files', folderOneFile: '1 file', emptyFolder: 'Empty folder', expandFolder: 'Expand folder', collapseFolder: 'Collapse folder', removeFolderTitle: 'Remove this folder?', removeFolderMessage: 'This removes the folder and its files from the Dropzone collection only. The original files on disk will not be deleted.', removeFolderConfirm: 'Remove folder and files', ungroupFolder: 'Remove folder', addSuccessItems: 'Added {count} item(s) to your collection.'
  },
  de: {
    localOnly: 'Dateien bleiben auf deinem Gerät', kicker: 'DEIN DATEI-ZWISCHENBEREICH', headline: 'Dateien sammeln. Gemeinsam bewegen.',
    subheadline: 'Sammle Dateien aus verschiedenen Orten und kopiere oder verschiebe sie gemeinsam – ohne ständig Ordner zu wechseln.',
    dropTitle: 'Dateien hier ablegen', dropDesc: 'Oder Dateien aus verschiedenen Ordnern hinzufügen. Verschoben wird erst, wenn du eine Aktion startest.', addFiles: 'Dateien hinzufügen', addFolder: 'Ordner hinzufügen', dropNow: 'Ablegen, um Dateien zu sammeln',
    collectionLabel: 'SAMMLUNG', yourFiles: 'Deine Dateien', exportList: 'Liste exportieren', clearAll: 'Alles leeren', searchPlaceholder: 'Sammlung durchsuchen…',
    fileHeader: 'DATEI', locationHeader: 'ORT', sizeHeader: 'GRÖSSE', statusHeader: 'STATUS', emptyTitle: 'Deine Dropzone ist leer',
    emptyDesc: 'Füge Dateien von überall auf deinem PC hinzu. Sie bleiben hier, bis du bereit bist.', browseFiles: 'Dateien auswählen', savedLocally: 'Deine Sammlung wird lokal gespeichert und beim nächsten Start wiederhergestellt.',
    transferLabel: 'NÄCHSTER SCHRITT', transferFiles: 'Dateien übertragen', transferDesc: 'Wähle aus, wohin deine markierten Dateien sollen.', destinationLabel: 'ZIELORDNER', noDestination: 'Kein Ziel ausgewählt', destinationHelp: 'Wähle einen Ordner, um fortzufahren',
    actionLabel: 'AKTION', copyFiles: 'Dateien kopieren', moveFiles: 'Dateien verschieben', ifExists: 'WENN EINE DATEI BEREITS EXISTIERT', renameConflict: 'Beide behalten (Datei umbenennen)',
    skipConflict: 'Eingehende Datei überspringen', selectedToTransfer: 'Ausgewählte Dateien', selectedSize: 'Gesamtgröße', safeNote: 'Dateien werden erst nach einem Klick verändert. Bestehende Dateien werden niemals überschrieben.',
    copySelected: 'Ausgewählte Dateien kopieren', moveSelected: 'Ausgewählte Dateien verschieben', selectHint: 'Wähle zuerst Dateien und einen Zielordner aus.', destinationNeeded: 'Wähle zuerst einen Zielordner aus.',
    chooseFilesFirst: 'Füge zuerst mindestens eine Datei hinzu oder wähle sie aus.', activityLabel: 'LETZTE AKTIVITÄT', lastTransfer: 'Letzte Übertragung', footerLocal: 'Lokal zuerst. Deine Dateien bleiben auf deinem PC.', about: 'Über LAPS',
    cancel: 'Abbrechen', confirm: 'Bestätigen', clearTitle: 'Sammlung leeren?', clearMessage: 'Dadurch werden die Dateien aus der Dropzone-Liste entfernt. Die Originaldateien werden nicht gelöscht.',
    moveTitle: 'Ausgewählte Dateien verschieben?', moveMessage: 'Erfolgreich verschobene Dateien werden am ursprünglichen Ort entfernt. Diese Aktion kann nicht automatisch rückgängig gemacht werden.',
    removeTitle: 'Datei entfernen?', removeMessage: 'Dadurch wird der Eintrag nur aus deiner Dropzone-Liste entfernt. Die Originaldatei bleibt an ihrem Ort.',
    clearConfirm: 'Sammlung leeren', moveConfirm: 'Dateien verschieben', removeConfirm: 'Datei entfernen', noMatchTitle: 'Keine passenden Dateien', noMatchDesc: 'Probiere eine andere Suche oder füge weitere Dateien hinzu.',
    missing: 'Fehlt', ready: 'Bereit', saving: 'Speichert…', saved: 'Gespeichert', saveFailed: 'Sammlung konnte nicht gespeichert werden', noFiles: 'Keine Dateien', oneFile: '1 Datei', files: 'Dateien', selected: 'ausgewählt',
    addSuccess: '{count} Datei(en) zur Sammlung hinzugefügt.', addNothing: 'Es wurden keine neuen Dateien hinzugefügt.', tooManyFolder: 'Der Ordner überschreitet das Scan-Limit. Es wurden nur die ersten Dateien hinzugefügt.',
    transferComplete: 'Übertragung fertig: {success} erfolgreich, {skipped} übersprungen, {errors} fehlgeschlagen.', transferFailed: 'Übertragung fehlgeschlagen: {message}', destinationSelected: 'Ziel ausgewählt',
    working: 'Wird ausgeführt…', copyAction: 'Ausgewählte Dateien kopieren', moveAction: 'Ausgewählte Dateien verschieben', noDestinationAction: 'Ziel auswählen',
    activitySuccess: 'Erledigt', activitySkipped: 'Übersprungen', activityError: 'Fehlgeschlagen', copied: 'Kopiert', moved: 'Verschoben',
    manifestSaved: 'Sammlungsliste exportiert.', aboutTitle: 'Über LAPS Dropzone', aboutMessage: 'LAPS Dropzone ist ein lokales Datei-Sammelwerkzeug von LAPS. Deine Dateien werden auf deinem Gerät verarbeitet und nicht von der App hochgeladen.',
    openWebsite: 'LAPS-Website öffnen', close: 'Schließen', folderScan: 'Ordner wird durchsucht…', confirmButton: 'Fortfahren',
    sameLocation: 'Die Datei befindet sich bereits im Zielordner.', existing: 'Eine Datei mit diesem Namen existiert bereits.', operationCopy: 'Kopieren', operationMove: 'Verschieben',
    sourceDirectory: 'Quellordner', viewCollection: 'Sammlung', selectVisible: 'Sichtbare Dateien auswählen', removeFile: 'Datei entfernen',
    droppedFolderNotSupported: 'Das abgelegte Element konnte nicht gelesen werden. Versuche es über „Ordner hinzufügen“.', folderEmpty: 'In diesem Ordner wurden keine Dateien gefunden.', folderUnreadable: 'Der Ordner konnte nicht gelesen werden. Prüfe die Berechtigungen oder nutze „Ordner hinzufügen“.', totalSelected: '{count} ausgewählt', nothingToExport: 'Füge Dateien hinzu, bevor du die Liste exportierst.', folder: 'Ordner', folderFiles: '{count} Dateien', folderOneFile: '1 Datei', emptyFolder: 'Leerer Ordner', expandFolder: 'Ordner ausklappen', collapseFolder: 'Ordner einklappen', removeFolderTitle: 'Diesen Ordner entfernen?', removeFolderMessage: 'Der Ordner und seine Dateien werden nur aus der Dropzone-Sammlung entfernt. Die Originaldateien auf der Festplatte bleiben erhalten.', removeFolderConfirm: 'Ordner und Dateien entfernen', ungroupFolder: 'Ordnerhülle entfernen', addSuccessItems: '{count} Element(e) zur Sammlung hinzugefügt.'
  }
};

const state = {
  language: localStorage.getItem('laps-dropzone-language') === 'de' ? 'de' : 'en',
  theme: localStorage.getItem('laps-dropzone-theme') === 'dark' ? 'dark' : 'light',
  files: [],
  folders: [],
  expandedFolders: new Set(),
  selected: new Set(),
  destination: localStorage.getItem('laps-dropzone-destination') || '',
  mode: 'copy',
  search: '',
  transferBusy: false,
  saveChain: Promise.resolve(),
  toastTimer: null
};

function t(key, vars = {}) {
  let value = translations[state.language][key] || translations.en[key] || key;
  for (const [name, replacement] of Object.entries(vars)) value = value.replaceAll(`{${name}}`, String(replacement));
  return value;
}

function bytes(n) {
  const value = Number(n);
  if (!Number.isFinite(value) || value < 0) return '—';
  if (value < 1000) return `${Math.round(value)} B`;
  const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
  let amount = value / 1000;
  let index = 0;
  while (amount >= 1000 && index < units.length - 1) { amount /= 1000; index += 1; }
  return `${new Intl.NumberFormat(state.language === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: amount < 10 ? 1 : 0 }).format(amount)} ${units[index]}`;
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  $$('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  $('#languageToggle').textContent = state.language === 'en' ? 'DE' : 'EN';
  $('#languageToggle').title = state.language === 'en' ? 'Switch to German' : 'Zu Englisch wechseln';
  $('#themeToggle').title = state.theme === 'light' ? (state.language === 'en' ? 'Switch to dark mode' : 'Dunklen Modus aktivieren') : (state.language === 'en' ? 'Switch to light mode' : 'Hellen Modus aktivieren');
  $('#themeGlyph').textContent = state.theme === 'light' ? '☾' : '☼';
  $('#selectVisible').setAttribute('aria-label', t('selectVisible'));
  $('#emptyAddBtn').textContent = t('browseFiles');
  $('#dialogCancel').textContent = t('cancel');
  updateTransferTexts();
  render();
}

function setTheme(theme) {
  state.theme = theme === 'dark' ? 'dark' : 'light';
  document.body.dataset.theme = state.theme;
  localStorage.setItem('laps-dropzone-theme', state.theme);
  applyTranslations();
}

function setLanguage(language) {
  state.language = language === 'de' ? 'de' : 'en';
  localStorage.setItem('laps-dropzone-language', state.language);
  applyTranslations();
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function setSaving(message, error = false) {
  const element = $('#saveIndicator');
  element.textContent = message;
  element.style.color = error ? 'var(--red)' : 'var(--green)';
}

function persistCollection() {
  const collection = {
    files: state.files.map((file) => file.path),
    folders: state.folders.map((folder) => folder.path)
  };
  setSaving(t('saving'));
  state.saveChain = state.saveChain.then(() => api.saveCollection(collection)).then(() => setSaving(t('saved'))).catch(() => setSaving(t('saveFailed'), true));
  return state.saveChain;
}

function normalizeForCompare(filePath) {
  let value = String(filePath || '').replace(/\\/g, '/').toLowerCase();
  if (value !== '/' && !/^[a-z]:\/$/.test(value)) value = value.replace(/\/+$/, '');
  return value;
}

function isPathWithin(filePath, folderPath) {
  const fileKey = normalizeForCompare(filePath);
  const folderKey = normalizeForCompare(folderPath);
  if (fileKey === folderKey) return true;
  const prefix = folderKey.endsWith('/') ? folderKey : `${folderKey}/`;
  return fileKey.startsWith(prefix);
}

function getFolderChildren(folder) {
  return state.files.filter((file) => isPathWithin(file.path, folder.path));
}

function matchesSearch(item) {
  const query = state.search.trim().toLocaleLowerCase(state.language === 'de' ? 'de-DE' : 'en-US');
  if (!query) return true;
  return `${item.name || ''} ${item.path || ''} ${item.extension || ''} ${item.directory || ''}`.toLocaleLowerCase().includes(query);
}

function getTopLevelItems() {
  const standaloneFiles = state.files.filter((file) => !state.folders.some((folder) => isPathWithin(file.path, folder.path)));
  return [
    ...state.folders.map((folder) => ({ type: 'folder', value: folder })),
    ...standaloneFiles.map((file) => ({ type: 'file', value: file }))
  ].sort((a, b) => String(a.value.name).localeCompare(String(b.value.name), state.language === 'de' ? 'de' : 'en', { numeric: true, sensitivity: 'base' }));
}

function getVisibleRootItems() {
  const folders = state.folders.filter((folder) => {
    if (matchesSearch(folder)) return true;
    return getFolderChildren(folder).some(matchesSearch);
  }).map((folder) => ({ type: 'folder', value: folder }));
  const standaloneFiles = state.files.filter((file) => !state.folders.some((folder) => isPathWithin(file.path, folder.path)) && matchesSearch(file))
    .map((file) => ({ type: 'file', value: file }));
  return [...folders, ...standaloneFiles].sort((a, b) => String(a.value.name).localeCompare(String(b.value.name), state.language === 'de' ? 'de' : 'en', { numeric: true, sensitivity: 'base' }));
}

function getVisibleFileRows() {
  const visible = [];
  const query = state.search.trim();
  for (const item of getVisibleRootItems()) {
    if (item.type === 'file') {
      visible.push(item.value);
      continue;
    }
    const folder = item.value;
    const children = getFolderChildren(folder);
    const matchingChildren = children.filter(matchesSearch);
    const folderMatches = matchesSearch(folder);
    const showChildren = state.expandedFolders.has(folder.path) || (query && !folderMatches && matchingChildren.length > 0);
    if (showChildren) visible.push(...(query && !folderMatches ? matchingChildren : children));
  }
  return visible;
}

function mergeFolderEntries(existing, incoming) {
  const unique = new Map();
  for (const folder of [...existing, ...incoming]) {
    if (!folder?.path) continue;
    const key = normalizeForCompare(folder.path);
    unique.set(key, folder);
  }
  const ordered = [...unique.values()].sort((a, b) => normalizeForCompare(a.path).length - normalizeForCompare(b.path).length);
  const roots = [];
  for (const folder of ordered) {
    if (roots.some((parent) => isPathWithin(folder.path, parent.path))) continue;
    roots.push(folder);
  }
  return roots.sort((a, b) => String(a.name).localeCompare(String(b.name), state.language === 'de' ? 'de' : 'en', { numeric: true, sensitivity: 'base' }));
}

async function addInputs(paths, options = {}) {
  const unique = Array.from(new Set((paths || []).filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim())));
  if (!unique.length) return;

  const inspected = await api.inspectInputs(unique);
  const fileMetadata = await api.describeFiles(inspected.paths || []);
  const folderMetadata = await api.describeFolders((inspected.folders || []).map((folder) => folder.path));
  const knownFiles = new Set(state.files.map((file) => normalizeForCompare(file.path)));
  const newFilePaths = [];
  let addedFileCount = 0;
  for (const file of fileMetadata) {
    const key = normalizeForCompare(file.path);
    if (knownFiles.has(key)) continue;
    knownFiles.add(key);
    state.files.push(file);
    newFilePaths.push(file.path);
    addedFileCount += 1;
  }

  const beforeFolders = new Set(state.folders.map((folder) => normalizeForCompare(folder.path)));
  state.folders = mergeFolderEntries(state.folders, folderMetadata);
  const activeFolderMap = new Map(state.folders.map((folder) => [normalizeForCompare(folder.path), folder]));
  const addedFolderCount = folderMetadata.filter((folder) => {
    const key = normalizeForCompare(folder.path);
    return !beforeFolders.has(key) && activeFolderMap.has(key);
  }).length;
  const addedVisibleFiles = newFilePaths.filter((filePath) => !state.folders.some((folder) => isPathWithin(filePath, folder.path))).length;
  // A large folder counts as one visible collection item, not thousands of separate root items.
  const totalAdded = addedFolderCount + (addedVisibleFiles || (addedFolderCount === 0 ? addedFileCount : 0));

  state.files.sort((a, b) => a.name.localeCompare(b.name, state.language === 'de' ? 'de' : 'en', { numeric: true, sensitivity: 'base' }));
  const activeFolders = new Set(state.folders.map((folder) => normalizeForCompare(folder.path)));
  state.expandedFolders = new Set([...state.expandedFolders].filter((folderPath) => activeFolders.has(normalizeForCompare(folderPath))));

  if (!totalAdded) {
    if (!fileMetadata.length && !folderMetadata.length && inspected.unreadableDirectories) showToast(t('folderUnreadable'));
    else if (!fileMetadata.length && !folderMetadata.length && inspected.directoriesScanned) showToast(t('folderEmpty'));
    else showToast(t('addNothing'));
    return;
  }

  await persistCollection();
  render();
  showToast(t('addSuccessItems', { count: totalAdded }));
  if (options.truncated || inspected.truncated) showToast(t('tooManyFolder'));
  if (inspected.unreadableDirectories) showToast(t('folderUnreadable'));
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function fileTypeClass(extension) {
  const ext = String(extension || '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'heic'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['zip', '7z', 'rar', 'tar', 'gz'].includes(ext)) return 'archive';
  return '';
}

function renderFileRow(file, isChild = false) {
  const row = document.createElement('tr');
  if (isChild) row.classList.add('child-row');
  if (state.selected.has(file.path)) row.classList.add('selected-row');

  const checkCell = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = state.selected.has(file.path);
  checkbox.setAttribute('aria-label', `${t('selected')}: ${file.name}`);
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) state.selected.add(file.path); else state.selected.delete(file.path);
    render();
  });
  checkCell.append(checkbox);

  const nameCell = document.createElement('td');
  const nameWrap = createElement('div', `file-name-cell${isChild ? ' child-file-name' : ''}`);
  if (isChild) nameWrap.append(createElement('span', 'child-indent', '↳'));
  const icon = createElement('span', `file-type-icon ${fileTypeClass(file.extension)}`, (file.extension || 'FILE').slice(0, 4));
  const textWrap = createElement('span', 'file-name-text');
  textWrap.title = file.path;
  textWrap.append(createElement('span', '', file.name));
  textWrap.append(createElement('small', 'file-subname', file.extension ? `.${file.extension.toLowerCase()}` : t('noFiles')));
  nameWrap.append(icon, textWrap);
  nameCell.append(nameWrap);

  const locationCell = createElement('td', 'location-cell', file.directory);
  locationCell.title = file.directory;
  const sizeCell = createElement('td', 'size-cell', file.exists ? bytes(file.size) : '—');
  const statusCell = document.createElement('td');
  const status = createElement('span', `status-pill${file.exists ? '' : ' missing'}`);
  status.append(createElement('span', 'status-dot'));
  status.append(document.createTextNode(file.exists ? t('ready') : t('missing')));
  statusCell.append(status);
  const removeCell = document.createElement('td');
  const remove = createElement('button', 'row-remove', '×');
  remove.type = 'button';
  remove.title = t('removeFile');
  remove.setAttribute('aria-label', `${t('removeFile')}: ${file.name}`);
  remove.addEventListener('click', async () => {
    const okay = await askConfirm(t('removeTitle'), t('removeMessage'), t('removeConfirm'));
    if (okay) removePaths(new Set([file.path]));
  });
  removeCell.append(remove);
  row.append(checkCell, nameCell, locationCell, sizeCell, statusCell, removeCell);
  return row;
}

function renderFolderRow(folder) {
  const children = getFolderChildren(folder);
  const selectedCount = children.filter((file) => state.selected.has(file.path)).length;
  const allSelected = children.length > 0 && selectedCount === children.length;
  const expanded = state.expandedFolders.has(folder.path);
  const row = document.createElement('tr');
  row.classList.add('folder-row');
  if (allSelected) row.classList.add('selected-row');
  if (!folder.exists) row.classList.add('missing-folder-row');
  row.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showFolderContextMenu(event.clientX, event.clientY, folder);
  });

  const checkCell = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = allSelected;
  checkbox.indeterminate = selectedCount > 0 && !allSelected;
  checkbox.disabled = children.length === 0;
  checkbox.setAttribute('aria-label', `${t('selected')}: ${folder.name}`);
  checkbox.addEventListener('change', () => {
    for (const file of children) {
      if (checkbox.checked) state.selected.add(file.path); else state.selected.delete(file.path);
    }
    render();
  });
  checkCell.append(checkbox);

  const nameCell = document.createElement('td');
  const nameWrap = createElement('div', 'file-name-cell folder-name-cell');
  const toggle = createElement('button', 'folder-toggle', expanded ? '▾' : '▸');
  toggle.type = 'button';
  toggle.disabled = children.length === 0;
  toggle.title = expanded ? t('collapseFolder') : t('expandFolder');
  toggle.setAttribute('aria-label', `${toggle.title}: ${folder.name}`);
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.addEventListener('click', () => {
    if (expanded) state.expandedFolders.delete(folder.path); else state.expandedFolders.add(folder.path);
    renderRows();
    $('#selectVisible').disabled = getVisibleFileRows().length === 0;
    const visibleFiles = getVisibleFileRows();
    $('#selectVisible').checked = visibleFiles.length > 0 && visibleFiles.every((file) => state.selected.has(file.path));
    $('#selectVisible').indeterminate = visibleFiles.some((file) => state.selected.has(file.path)) && !$('#selectVisible').checked;
  });
  const icon = createElement('span', 'file-type-icon folder-icon', 'DIR');
  const textWrap = createElement('span', 'file-name-text');
  textWrap.title = folder.path;
  textWrap.append(createElement('span', '', folder.name));
  const countText = children.length === 1 ? t('folderOneFile') : t('folderFiles', { count: children.length });
  textWrap.append(createElement('small', 'file-subname', countText));
  nameWrap.append(toggle, icon, textWrap);
  nameCell.append(nameWrap);

  const locationCell = createElement('td', 'location-cell', folder.directory);
  locationCell.title = folder.path;
  const size = children.reduce((sum, file) => sum + (file.exists ? Number(file.size) || 0 : 0), 0);
  const sizeCell = createElement('td', 'size-cell', bytes(size));
  const statusCell = document.createElement('td');
  const statusLabel = !folder.exists ? t('missing') : (children.length === 0 ? t('emptyFolder') : countText);
  const status = createElement('span', `status-pill folder-count${folder.exists ? '' : ' missing'}`, statusLabel);
  statusCell.append(status);

  const removeCell = document.createElement('td');
  const remove = createElement('button', 'row-remove', '×');
  remove.type = 'button';
  remove.title = t('removeFolderConfirm');
  remove.setAttribute('aria-label', `${t('removeFolderConfirm')}: ${folder.name}`);
  remove.addEventListener('click', async () => {
    const okay = await askConfirm(t('removeFolderTitle'), t('removeFolderMessage'), t('removeFolderConfirm'));
    if (okay) removeFolder(folder.path);
  });
  removeCell.append(remove);
  row.append(checkCell, nameCell, locationCell, sizeCell, statusCell, removeCell);
  return row;
}

function renderRows() {
  const tbody = $('#fileRows');
  tbody.replaceChildren();
  const roots = getVisibleRootItems();
  const query = state.search.trim();

  for (const item of roots) {
    if (item.type === 'file') {
      tbody.append(renderFileRow(item.value));
      continue;
    }

    const folder = item.value;
    tbody.append(renderFolderRow(folder));
    const children = getFolderChildren(folder);
    const matchingChildren = children.filter(matchesSearch);
    const folderMatches = matchesSearch(folder);
    const showChildren = state.expandedFolders.has(folder.path) || (query && !folderMatches && matchingChildren.length > 0);
    if (showChildren) {
      const childrenToRender = query && !folderMatches ? matchingChildren : children;
      for (const file of childrenToRender) tbody.append(renderFileRow(file, true));
    }
  }

  const table = $('.file-table');
  const empty = $('#emptyState');
  if (roots.length === 0) {
    empty.hidden = false;
    table.hidden = true;
    const hasItems = state.files.length > 0 || state.folders.length > 0;
    $('#emptyState h3').textContent = hasItems ? t('noMatchTitle') : t('emptyTitle');
    $('#emptyState p').textContent = hasItems ? t('noMatchDesc') : t('emptyDesc');
    $('#emptyAddBtn').hidden = hasItems;
  } else {
    empty.hidden = true;
    table.hidden = false;
  }
  const visibleFiles = getVisibleFileRows();
  const allVisibleSelected = visibleFiles.length > 0 && visibleFiles.every((file) => state.selected.has(file.path));
  $('#selectVisible').checked = allVisibleSelected;
  $('#selectVisible').indeterminate = visibleFiles.some((file) => state.selected.has(file.path)) && !allVisibleSelected;
}

function render() {
  renderRows();
  $('#fileCount').textContent = String(getTopLevelItems().length);
  $('#selectionSummary').textContent = `${state.selected.size} ${t('selected')}`;
  const selectedFiles = state.files.filter((file) => state.selected.has(file.path));
  const selectedSize = selectedFiles.reduce((sum, file) => sum + (file.exists ? file.size : 0), 0);
  $('#transferCount').textContent = `${selectedFiles.length} ${state.language === 'de' ? (selectedFiles.length === 1 ? 'Datei' : 'Dateien') : (selectedFiles.length === 1 ? 'file' : 'files')}`;
  $('#transferSize').textContent = bytes(selectedSize);
  $('#destinationText').textContent = state.destination ? state.destination.split(/[\\/]/).filter(Boolean).slice(-1)[0] : t('noDestination');
  $('#destinationText').title = state.destination;
  $('#destinationSubtext').textContent = state.destination || t('destinationHelp');
  $('#transferBtn').disabled = state.transferBusy || selectedFiles.length === 0 || !state.destination;
  $('#selectVisible').disabled = getVisibleFileRows().length === 0;
  updateTransferTexts();
}

function updateTransferTexts() {
  $('#transferBtnLabel').textContent = state.mode === 'copy' ? t('copySelected') : t('moveSelected');
  if (state.transferBusy) $('#transferBtnLabel').textContent = t('working');
  $('#transferHint').textContent = state.files.length === 0 || state.selected.size === 0 ? t('selectHint') : (!state.destination ? t('destinationNeeded') : '');
  $('#copyModeBtn').classList.toggle('active', state.mode === 'copy');
  $('#moveModeBtn').classList.toggle('active', state.mode === 'move');
}

function removePaths(paths) {
  state.files = state.files.filter((file) => !paths.has(file.path));
  for (const filePath of paths) state.selected.delete(filePath);
  persistCollection();
  render();
}

function ungroupFolder(folderPath) {
  // Remove only the visual folder wrapper. Keep every child file in the collection.
  state.folders = state.folders.filter((folder) => normalizeForCompare(folder.path) !== normalizeForCompare(folderPath));
  state.expandedFolders.delete(folderPath);
  persistCollection();
  hideFolderContextMenu();
  render();
  showToast(t('ungroupFolder'));
}

function hideFolderContextMenu() {
  const menu = $('#folderContextMenu');
  if (menu) menu.hidden = true;
}

function showFolderContextMenu(x, y, folder) {
  const menu = $('#folderContextMenu');
  const action = $('#ungroupFolderAction');
  action.textContent = t('ungroupFolder');
  action.onclick = () => ungroupFolder(folder.path);
  menu.hidden = false;
  const maxX = window.innerWidth - menu.offsetWidth - 8;
  const maxY = window.innerHeight - menu.offsetHeight - 8;
  menu.style.left = `${Math.max(8, Math.min(x, maxX))}px`;
  menu.style.top = `${Math.max(8, Math.min(y, maxY))}px`;
}

function removeFolder(folderPath) {
  const folderKey = normalizeForCompare(folderPath);
  const removed = new Set(state.files.filter((file) => isPathWithin(file.path, folderPath)).map((file) => file.path));
  state.files = state.files.filter((file) => !removed.has(file.path));
  state.folders = state.folders.filter((folder) => normalizeForCompare(folder.path) !== folderKey && !isPathWithin(folder.path, folderPath));
  state.expandedFolders.delete(folderPath);
  for (const filePath of removed) state.selected.delete(filePath);
  persistCollection();
  render();
}

function askConfirm(title, message, confirmLabel) {
  const dialog = $('#confirmDialog');
  $('#dialogTitle').textContent = title;
  $('#dialogMessage').textContent = message;
  $('#dialogConfirm').textContent = confirmLabel || t('confirm');
  $('#dialogCancel').textContent = t('cancel');
  dialog.showModal();
  return new Promise((resolve) => {
    const finish = (value) => {
      dialog.close();
      $('#dialogConfirm').removeEventListener('click', onConfirm);
      $('#dialogCancel').removeEventListener('click', onCancel);
      dialog.removeEventListener('cancel', onCancel);
      resolve(value);
    };
    const onConfirm = () => finish(true);
    const onCancel = () => finish(false);
    $('#dialogConfirm').addEventListener('click', onConfirm, { once: true });
    $('#dialogCancel').addEventListener('click', onCancel, { once: true });
    dialog.addEventListener('cancel', onCancel, { once: true });
  });
}

async function pickFiles() {
  try {
    const result = await api.pickFiles();
    if (result && !result.canceled) await addInputs(result.paths);
  } catch (error) { showToast(error.message || String(error)); }
}

async function pickFolder() {
  try {
    const result = await api.pickFolder();
    if (!result || result.canceled) return;
    if (!result.paths?.length) return;
    await addInputs(result.paths, { truncated: result.truncated });
  } catch (error) { showToast(error.message || String(error)); }
}

async function chooseDestination() {
  try {
    const result = await api.pickDestination();
    if (!result) return;
    state.destination = result;
    localStorage.setItem('laps-dropzone-destination', result);
    render();
    showToast(t('destinationSelected'));
  } catch (error) { showToast(error.message || String(error)); }
}

function renderActivity(result, mode) {
  $('#activityPanel').hidden = false;
  $('#activityList').replaceChildren();
  $('#activityBadge').textContent = `${result.success} ${t('activitySuccess').toLowerCase()} · ${result.skipped} ${t('activitySkipped').toLowerCase()} · ${result.errors} ${t('activityError').toLowerCase()}`;
  for (const entry of result.results.slice(0, 80)) {
    const row = createElement('div', 'activity-row');
    const status = createElement('span', `activity-status ${entry.status === 'error' ? 'error' : entry.status === 'skipped' ? 'skipped' : ''}`, entry.status === 'success' ? '✓' : entry.status === 'skipped' ? '–' : '!');
    const copy = createElement('div', 'activity-copy');
    copy.append(createElement('strong', '', entry.name));
    const desc = entry.status === 'success' ? (mode === 'copy' ? t('copied') : t('moved')) : entry.message;
    copy.append(createElement('small', '', desc));
    row.append(status, copy);
    $('#activityList').append(row);
  }
}

async function runTransfer() {
  const selected = state.files.filter((file) => state.selected.has(file.path));
  if (!selected.length) { showToast(t('chooseFilesFirst')); return; }
  if (!state.destination) { await chooseDestination(); if (!state.destination) return; }
  if (state.mode === 'move') {
    const okay = await askConfirm(t('moveTitle'), t('moveMessage'), t('moveConfirm'));
    if (!okay) return;
  }
  state.transferBusy = true;
  render();
  try {
    const result = await api.transferFiles(selected.map((file) => file.path), state.destination, state.mode, $('#conflictMode').value);
    renderActivity(result, state.mode);
    if (state.mode === 'move') {
      const moved = new Set(result.results.filter((entry) => entry.status === 'success').map((entry) => entry.path));
      if (moved.size) removePaths(moved);
    }
    showToast(t('transferComplete', { success: result.success, skipped: result.skipped, errors: result.errors }));
  } catch (error) {
    showToast(t('transferFailed', { message: error.message || String(error) }));
  } finally {
    state.transferBusy = false;
    render();
  }
}

async function exportList() {
  if (!state.files.length) { showToast(t('nothingToExport')); return; }
  try {
    const result = await api.exportManifest(state.files.map((file) => file.path));
    if (!result.canceled) showToast(t('manifestSaved'));
  } catch (error) { showToast(error.message || String(error)); }
}

function clearCollection() {
  return askConfirm(t('clearTitle'), t('clearMessage'), t('clearConfirm')).then((okay) => {
    if (!okay) return;
    state.files = [];
    state.folders = [];
    state.expandedFolders.clear();
    state.selected.clear();
    persistCollection();
    render();
  });
}

async function loadSavedCollection() {
  try {
    const saved = await api.loadCollection();
    // Accept legacy flat path arrays, but restore the folder grouping for version 1.0.0 collections.
    const filePaths = Array.isArray(saved) ? saved : (saved?.files || []);
    const folderPaths = Array.isArray(saved) ? [] : (saved?.folders || []);
    if (filePaths.length) state.files = await api.describeFiles(filePaths);
    if (folderPaths.length) state.folders = mergeFolderEntries([], await api.describeFolders(folderPaths));
    render();
  } catch (error) {
    showToast(error.message || String(error));
  }
}

$('#addFilesBtn').addEventListener('click', pickFiles);
$('#addFolderBtn').addEventListener('click', pickFolder);
$('#emptyAddBtn').addEventListener('click', pickFiles);
$('#chooseDestinationBtn').addEventListener('click', chooseDestination);
$('#transferBtn').addEventListener('click', runTransfer);
$('#exportBtn').addEventListener('click', exportList);
$('#clearBtn').addEventListener('click', clearCollection);
$('#copyModeBtn').addEventListener('click', () => { state.mode = 'copy'; render(); });
$('#moveModeBtn').addEventListener('click', () => { state.mode = 'move'; render(); });
$('#themeToggle').addEventListener('click', () => setTheme(state.theme === 'light' ? 'dark' : 'light'));
$('#languageToggle').addEventListener('click', () => setLanguage(state.language === 'en' ? 'de' : 'en'));
$('#searchInput').addEventListener('input', (event) => { state.search = event.target.value; renderRows(); });
$('#selectVisible').addEventListener('change', (event) => {
  for (const file of getVisibleFileRows()) {
    if (event.target.checked) state.selected.add(file.path); else state.selected.delete(file.path);
  }
  render();
});
$('#aboutBtn').addEventListener('click', () => {
  askConfirm(t('aboutTitle'), t('aboutMessage'), t('openWebsite')).then(async (okay) => {
    if (!okay) return;
    try { await api.openExternal('https://sites.google.com/view/laps-web/home'); }
    catch (error) { showToast(error.message || String(error)); }
  });
});

const dropTarget = $('#dropTarget');

function isFileDrag(event) {
  const types = Array.from(event.dataTransfer?.types || []);
  return types.includes('Files') || types.includes('application/x-moz-file');
}

// Catch file drops on the entire app window, not only on the visual drop-zone card.
window.addEventListener('dragenter', (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  dropTarget.classList.add('drag-over');
}, true);
window.addEventListener('dragover', (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  dropTarget.classList.add('drag-over');
}, true);
window.addEventListener('dragleave', (event) => {
  if (event.clientX <= 0 || event.clientY <= 0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
    dropTarget.classList.remove('drag-over');
  }
}, true);
window.addEventListener('drop', async (event) => {
  if (!isFileDrag(event) && !event.dataTransfer?.files?.length) return;
  event.preventDefault();
  event.stopPropagation();
  dropTarget.classList.remove('drag-over');

  const droppedFiles = Array.from(event.dataTransfer?.files || []);
  for (const item of Array.from(event.dataTransfer?.items || [])) {
    if (item.kind !== 'file') continue;
    const file = item.getAsFile();
    if (file) droppedFiles.push(file);
  }
  const paths = Array.from(new Set(droppedFiles.map((file) => api.pathForDroppedFile(file)).filter(Boolean)));
  if (!paths.length) { showToast(t('droppedFolderNotSupported')); return; }

  try {
    await addInputs(paths);
  } catch (error) { showToast(error.message || String(error)); }
}, true);

document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('#folderContextMenu')) hideFolderContextMenu();
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    $('#searchInput').focus();
    $('#searchInput').select();
  }
  if (event.key === 'Escape' && $('#confirmDialog').open) $('#confirmDialog').close();
  if (event.key === 'Escape') hideFolderContextMenu();
});

// Preference defaults are intentionally light + English, regardless of the OS theme.
document.body.dataset.theme = state.theme;
applyTranslations();
loadSavedCollection();
