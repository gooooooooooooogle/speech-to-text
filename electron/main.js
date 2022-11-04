const { app, BrowserWindow, ipcMain, Menu, Notification } = require('electron');
const path = require('path')
const api = require('./api.js')

if (process.env.NODE_ENV === 'development') require('electron-reloader')(module);

const URL = process.env.NODE_ENV === 'development'
  ? `http://localhost:5173`
  : `file://${path.join(__dirname, '../dist/index.html')}`

let mainForm = null;
function createWindow() {
  mainForm = new BrowserWindow({
    width: 800,
    height: 500,
    icon: path.join(__dirname, '../public/icons/icon32.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainForm.resizable = false;

  Menu.setApplicationMenu(null);
  mainForm.webContents.openDevTools();
  mainForm.loadURL(URL);
}

// ipc通信
ipcMain.handle('selectAudioFile', api.selectAudioFile);
ipcMain.handle('selectTextPath', api.selectTextPath);
ipcMain.on('openResultPath', api.openResultPath);
ipcMain.handle('startChange', api.audioChange);
ipcMain.handle('getUserName', api.getUserName);


if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}).then(() => {
  new Notification({ title: '消息', body: '欢迎您！' }).show();
})

app.on('closed', () => {
  mainForm = null;
});

app.on('window-all-closed', () => {
  // win32 : (Windows), linux (Linux) 
  // darwin: (macOS) 
  if (process.platform !== 'darwin') app.quit();
})