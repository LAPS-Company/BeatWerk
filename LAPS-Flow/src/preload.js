const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lapsFlow', {
  getMeta: () => ipcRenderer.invoke('app:meta'),
  listWorkflows: () => ipcRenderer.invoke('workflow:list'),
  saveWorkflow: (workflow) => ipcRenderer.invoke('workflow:save', workflow),
  validateWorkflow: (workflow) => ipcRenderer.invoke('workflow:validate', workflow),
  createBackup: () => ipcRenderer.invoke('workflow:backup'),
  restoreBackup: () => ipcRenderer.invoke('workflow:restore-backup'),
  closeAfterSave: () => ipcRenderer.invoke('app:close-after-save'),
  deleteWorkflow: (id) => ipcRenderer.invoke('workflow:delete', id),
  selectPath: (options) => ipcRenderer.invoke('dialog:select-path', options),
  selectSavePath: (options) => ipcRenderer.invoke('dialog:save-file-path', options),
  exportWorkflow: (workflow) => ipcRenderer.invoke('workflow:export', workflow),
  importWorkflow: () => ipcRenderer.invoke('workflow:import'),
  openExternal: (url) => ipcRenderer.invoke('system:open-external', url),
  listWindows: () => ipcRenderer.invoke('system:list-windows'),
  runWorkflow: (workflow, options = {}) => ipcRenderer.invoke('workflow:run', workflow, options),
  continueDebug: () => ipcRenderer.invoke('workflow:debug-continue'),
  cancelWorkflow: () => ipcRenderer.invoke('workflow:cancel'),
  listHistory: () => ipcRenderer.invoke('history:list'),
  clearHistory: () => ipcRenderer.invoke('history:clear'),
  getHistoryRecord: (id) => ipcRenderer.invoke('history:get', id),
  rerunFromHistoryStep: (payload) => ipcRenderer.invoke('history:rerun-from-step', payload),
  onFlowLog: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('flow:log', handler);
    return () => ipcRenderer.removeListener('flow:log', handler);
  }
});
