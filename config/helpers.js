const path = require('path');

const rootPath = path.resolve(__dirname, '..');

exports.root = (...args) => path.join(...[rootPath].concat(args));
