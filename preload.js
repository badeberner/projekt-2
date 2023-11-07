const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendLogin: (credentials) => ipcRenderer.invoke('login', credentials),
    sendRegister: (credentials) => ipcRenderer.invoke('register', credentials)
    
});



