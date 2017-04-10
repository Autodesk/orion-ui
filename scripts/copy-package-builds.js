#!/usr/bin/env node
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

require('shelljs/global');

const constants = require('./modules/constants');
const knownPaths = require('./modules/known-paths');
const path = require('path');

/**
 * Returns true or false depending on if the provided directoryName has a build
 * directory inside it
 */
function hasBuildDirectory(directoryName) {
  return test(
    '-e',
    path.join(knownPaths.packages, directoryName, constants.buildDirName)
  );
}

/**
 * Copies directoryName/build to root/build/directoryName
 */
function copyToRootBuild(directoryName) {
  console.log(`- copying build from ${directoryName} to the root build`);
  const source = path.join(
    knownPaths.packages,
    directoryName,
    constants.buildDirName
  );
  const destination = path.join(knownPaths.build, directoryName);
  cp('-R', source, destination);
}

/**
 * Main program
 *
 * - creates build directory if needed
 * - copies all build directories found in packages into the root and renames
 *   them to the package name
 * - outputs the number of package builds found to the console
 */

// Make sure we have a build directory
mkdir('-p', knownPaths.build);

function countTrues(count, bool) {
  const newCount = bool ? count + 1 : count;

  return newCount;
}

// For each package, check for a build directory and if found, copy it into the
// root build directory
const buildCount = ls(knownPaths.packages)
  .map(directory => {
    if (hasBuildDirectory(directory)) {
      copyToRootBuild(directory);
      return true;
    }
    return false;
  })
  .reduce(countTrues, 0);

console.log(`${buildCount} builds copied to root`);
