const path = require('path');
const constants = require('./constants');

const root = path.join(__dirname, '..', '..', '..');
const build = path.join(root, constants.buildDirName);
const packages = path.join(root, constants.packageDirName);
const tmp = path.join(root, 'tmp');

module.exports = {
  /**
   * Top level repo directory
   */
  root,

  /**
   * Top level build directory
   */
  build,

  /**
   * Top level packages directory
   */
  packages,

  /**
   * Temporary files directory
   */
  tmp,
};
