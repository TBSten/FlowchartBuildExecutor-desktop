export interface IElectronAPI {
  toggleDevTools: Function,
  saveDataLocal: Function,
  loadDataLocal: Function,
}

declare global {
  interface Window {
    myAPI: IElectronAPI;
    showDebug: Function;
  }
}


