#!/usr/bin/env Node
/* eslint-env shelljs */
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
const constants = require('./modules/constants');
const knownPaths = require('./modules/known-paths');
const path = require('path');

require('shelljs/global');

/**
 * Returns true or false depending on if the provided directoryName has a build
 * directory inside it
 */
function hasBuildDirectory(directoryName) {
  return test('-e',
    path.join(knownPaths.packages, directoryName, constants.buildDirName));
}

/**
 * Main program
 *
 * - remove all package builds
 * - remove top level build dir
 */
function countTrues(count, bool) {
  const newCount = (bool) ? count + 1 : count;

  return newCount;
}

const cleanCount = ls(knownPaths.packages).map((directory) => {
  if (hasBuildDirectory(directory)) {
    console.log(`- cleaning build ${directory}`);
    rm('-r', path.join(knownPaths.packages, directory, constants.buildDirName));
    return true;
  }

  return false;
}).reduce(countTrues, 0);

console.log(`${cleanCount} builds cleaned`);

if (test('-e', knownPaths.build)) {
  rm('-r', knownPaths.build);
  console.log('Root build cleaned');
}
