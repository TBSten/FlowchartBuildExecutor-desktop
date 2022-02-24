import path from 'path';
import { BrowserWindow, app, ipcMain, session, dialog } from 'electron';
import { writeFile, readFile } from "fs/promises";

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  const execPath =
    process.platform === 'win32'
      ? '../node_modules/electron/dist/electron.exe'
      : '../node_modules/.bin/electron';

  require('electron-reload')(__dirname, {
    electron: path.resolve(__dirname, execPath),
  });
}



let mainWindow: BrowserWindow | null;

const createWindow = () => {

  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    // frame: false,
  });

  ipcMain.on('update-title', (_e, arg) => {
    mainWindow!.setTitle(`Electron React TypeScript: ${arg}`);
  });

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.loadFile('dist/index.html');
};

app.whenReady().then(createWindow);
app.once('window-all-closed', () => app.quit());


//--------------------------
// IPC
//--------------------------

ipcMain.handle("toggleDevTools", (event) => {
  mainWindow!.webContents.toggleDevTools();
  console.log("console.log on node")
})

ipcMain.handle("saveDataLocal", async (event, data) => {
  try {
    console.log("ipcMain saveDataLocal")
    const fname = data.name;
    const fdata = data.data;
    console.log("save dialog", fname)
    const selectResult = await dialog.showSaveDialog(mainWindow!, {
      title: "FBEファイルをローカルに保存",
      showsTagField: true,
      buttonLabel: "FBEファイルを保存",
      message: `${fname}を保存する`,
    });
    const target = selectResult.filePath;
    if (selectResult.canceled || !target) return false;
    console.log("write file data", target);
    await writeFile(target, fdata);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
})

ipcMain.handle("loadDataLocal", async (event, data) => {
  try {
    const selectResult = await dialog.showOpenDialog(mainWindow!, {
      title: "開くファイルを選択する",
      properties: [
        "openFile",
      ],
      message: "this is message",
    });
    if (selectResult.canceled || selectResult.filePaths.length <= 0) return null;
    const selectPath = selectResult.filePaths[0];
    const fileData = readFile(selectPath, { encoding: "utf-8" });
    console.log("read file")
    console.log(fileData);
    return fileData;
  } catch (e) {
    return null;
  }
})


