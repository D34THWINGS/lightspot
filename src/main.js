const { app, BrowserWindow, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');
const url = require('url');

require('./app/modules/launcher/launcher');

/**
 * @type {BrowserWindow}
 */
let win;

/**
 * @type {Tray}
 */
let tray;

const isDev = process.env.NODE_ENV === 'dev';

global.originalWindowSize = {
  width: 750,
  height: 105,
};

app.dock.hide();

function createWindow() {
  win = new BrowserWindow({
    width: global.originalWindowSize.width,
    height: global.originalWindowSize.height,
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    hasShadow: false,
    skipTaskbar: true,
    fullscreenable: false,
    alwaysOnTop: true,
    webPreferences: {
      devTools: isDev,
    },
  });

  win.setVisibleOnAllWorkspaces(true);

  if (isDev) {
    win.loadURL('http://localhost:8080');
    win.webContents.openDevTools();
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });
}

function toggleWindow() {
  if (win) {
    win.webContents.send('toggle-visibility');
  } else {
    createWindow();
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, './assets/images/tray-icons/spotlightTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit Lightspot' },
  ]);

  contextMenu.items[0].click = () => app.quit();

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
