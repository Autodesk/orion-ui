/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
const path = require('path');
const constants = require('./constants');

const root = path.join(__dirname, '..', '..');
const build = path.join(root, constants.buildDirName);
const packages = path.join(root, constants.packageDirName);
const scripts = path.join(packages, constants.scriptsPackageDirName);
const coverage = path.join(root, constants.coverageDirName);

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
   * The scripts package
   */
  scripts,

  /**
   * Top level code coverage directory
   */
  coverage
};
