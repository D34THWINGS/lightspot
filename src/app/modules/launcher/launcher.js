/* eslint-disable no-bitwise */

const { spawn } = require('child_process');
const { ipcMain } = require('electron');
const { promisify } = require('util');
const fs = require('fs');
const bmp = require('bmp-js');

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const recursiveIndexing = async (path) => {
  const files = await readdir(path);

  const results = [];
  const folders = [];
  files.forEach((file) => {
    if (/\.app$/.test(file)) {
      results.push(`${path}/${file}`);
      return;
    }

    if (/\.[\w]+$/.test(file)) {
      return;
    }

    folders.push(`${path}/${file}`);
  });

  const folderResults = await Promise.all(folders.map(async (folder) => {
    const fileStats = await stat(folder);

    if (fileStats.isDirectory()) {
      return recursiveIndexing(folder);
    }

    return Promise.resolve([]);
  }));

  return results.concat(...folderResults);
};


const getRLEPixels = (data) => {
  const outData = new Array(1024);

  // Alpha
  let myshift = 24;
  let mymask = 0xFF000000;
  let r = 0;

  // Drop in a fully opaque alpha channel - apply mask later
  for (let i = 0; i < outData.length; i += 1) {
    outData[i] |= 0xFF000000;
  }

  // Red, Green, Blue
  while (myshift > 0) {
    myshift -= 8;
    mymask >>>= 8;
    let y = 0;
    while (y < outData.length) {
      if ((data[r] & 0b10000000) === 0) {
        // top bit is clear - run of various vals to follow
        const len = (0b01111111 & data[r++]) + 1; // 1 <= len <= 128
        for (let i = 0; i < len; i++) {
          outData[y++] |= (data[r++] << myshift) & mymask;
        }
      } else {
        // top bit is set - run of one val to follow
        const len = (0b01111111 & data[r++]) - 125; // 3 <= len <= 130
        const val = (data[r++] << myshift) & mymask;
        for (let i = 0; i < len; i++) {
          outData[y++] |= val;
        }
      }
    }
  }

  return outData;
}

const getIcon = (buffer) => {
  const size = buffer.readUIntBE(4, 4);
  let offset = 8;
  let iconType;
  while (offset < size) {
    iconType = buffer.slice(offset, offset + 4).toString();
    if (~['icp4', 'icp5', 'icp6', 'ic07', 'ic08', 'ic09'].indexOf(iconType)) {
      console.log(iconType);
      const data = buffer.slice(offset + 8, (offset + buffer.readUIntBE(offset + 4, 4)) - 8);
      return `data:image/png;base64, ${data.toString('base64')}`;
    } else {
      offset += buffer.readUIntBE(offset + 4, 4);
    }
  }
  return '';
};

const indexApplications = async () => {
  const apps = await recursiveIndexing('/Applications');

  const icons = await Promise.all(apps.map(async (app) => {
    try {
      const files = await readdir(`${app}/Contents/Resources`);
      const icnsFileName = files.find(file => /\.icns$/.test(file));
      if (!icnsFileName) {
        return;
      }
      const icns = await readFile(`${app}/Contents/Resources/${icnsFileName}`);
      return getIcon(icns);
    } catch (e) {
      console.error(e);
      // Do nothing
    }
  }));

  return apps.map((app, i) => ({
    name: app.match(/.+\/(.+)\.app$/)[1],
    path: app,
    icon: icons[i],
  }));
};

ipcMain.on('@launcher:index', async (e) => {
  try {
    const apps = await indexApplications();
    e.sender.send('@launcher:indexed', apps);
  } catch (err) {
    console.error(err);
  }
});

ipcMain.on('@launcher:launch', (e, path, ...args) => {
  console.log(path);
  spawn('open', [path, '--args', ...args], { detached: true });
});

module.exports = {
  indexApplications,
};
