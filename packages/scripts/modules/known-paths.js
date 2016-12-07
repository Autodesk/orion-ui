const path = require('path');
const constants = require('./constants');

const root = path.join(__dirname, '..', '..', '..');
const build = path.join(root, constants.buildDirName);
const packages = path.join(root, constants.packageDirName);

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
  packages
};
