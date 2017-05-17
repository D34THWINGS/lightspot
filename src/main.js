const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const robotjs = require('robotjs');

// Expose system mouse position getter for window dragging
global.getMousePos = () => robotjs.getMousePos();

let win;
let tray;

function createWindow() {
  win = new BrowserWindow({
    width: 750,
    height: 105,
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    hasShadow: false,
  });
  win.loadURL('http://localhost:8080');
  win.webContents.openDevTools();

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });

  tray = new Tray(path.join(__dirname, './app/assets/images/tray-icons/spotlightTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
