#!/usr/bin/env Node
/* eslint-env shelljs */

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
  return count + (bool) ? 1 : 0;
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

