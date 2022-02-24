import { contextBridge, ipcRenderer } from 'electron';

const api: Window["myAPI"] = {
  toggleDevTools: async () => await ipcRenderer.invoke("toggleDevTools"),
  saveDataLocal: async (data: unknown) => await ipcRenderer.invoke("saveDataLocal", data),
  loadDataLocal: async (data: unknown) => await ipcRenderer.invoke("loadDataLocal", data),
};
contextBridge.exposeInMainWorld('myAPI', api);



