const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dofusdb', {
  quit: async () => {
    try {
      await ipcRenderer.invoke('quit');
    } catch (error) {
      console.error('Error invoking quit:', error);
    }
  },
});
