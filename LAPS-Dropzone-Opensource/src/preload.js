'use strict';

const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('dropzoneAPI', Object.freeze({
  pickFiles: () => ipcRenderer.invoke('dialog:pick-files'),
  pickFolder: () => ipcRenderer.invoke('dialog:pick-folder'),
  inspectInputs: (paths) => ipcRenderer.invoke('files:inspect-inputs', paths),
  expandDroppedPaths: (paths) => ipcRenderer.invoke('files:expand-dropped-paths', paths),
  pickDestination: () => ipcRenderer.invoke('dialog:pick-destination'),
  describeFiles: (paths) => ipcRenderer.invoke('files:describe', paths),
  describeFolders: (paths) => ipcRenderer.invoke('folders:describe', paths),
  loadCollection: () => ipcRenderer.invoke('collection:load'),
  saveCollection: (paths) => ipcRenderer.invoke('collection:save', paths),
  transferFiles: (paths, destination, mode, conflictMode) => ipcRenderer.invoke('files:transfer', paths, destination, mode, conflictMode),
  exportManifest: (paths) => ipcRenderer.invoke('manifest:export', paths),
  openExternal: (url) => ipcRenderer.invoke('app:open-external', url),
  pathForDroppedFile: (file) => {
    try { return webUtils.getPathForFile(file); } catch { return ''; }
  }
}));
