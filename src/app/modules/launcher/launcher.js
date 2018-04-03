const { spawn } = require('child_process');
const { ipcMain } = require('electron');
const { promisify } = require('util');
const fs = require('fs');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const recursiveIndexing = async (path) => {
  const files = await readdir(path);

  return Promise.all(files.map((file) => {
    if (/\.app$/.test(file)) {
      return Promise.resolve(`${path}/${file}`);
    }

    if (/\.[\w]+$/.test(file)) {
      return Promise.resolve();
    }

    return stat(`${path}/${file}`).then((fileStats) => {
      if (fileStats.isDirectory()) {
        return recursiveIndexing(`${path}/${file}`);
      }

      return Promise.resolve();
    });
  }));
};

const recursiveFlatten = tmpApps => tmpApps.reduce((acc, app) => {
  if (Array.isArray(app)) {
    acc.push(...recursiveFlatten(app));
  } else if (typeof app === 'undefined') {
    return acc;
  } else {
    acc.push(app);
  }

  return acc;
}, []);

const indexApplications = async () => {
  const apps = await recursiveIndexing('/Applications');

  return recursiveFlatten(apps)
    .map(app => ({
      name: app.match(/.+\/(.+)\.app$/)[1],
      path: app,
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

ipcMain.on('@launcher:launch', (e, path) => {
  console.log(path);
  spawn('open', [path], { detached: true });
});

module.exports = {
  indexApplications,
};
