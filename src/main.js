const { app, BrowserWindow, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');
const url = require('url');

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
  win.loadURL(process.env.NODE_ENV !== 'production' ? 'http://localhost:8080' : url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  win.webContents.openDevTools();

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });
}

function toggleWindow() {
  if (win) {
    win.close();
  } else {
    createWindow();
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, './app/assets/images/tray-icons/spotlightTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Toggle Lightspot', accelerator: 'Esc', click: toggleWindow },
    { label: 'Quit Lightspot' },
  ]);

  contextMenu.items[1].click = () => app.quit();

  tray.setToolTip('Lightspot');
  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  globalShortcut.register('Alt+Space', toggleWindow);

  createTray();
  createWindow();
});

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
