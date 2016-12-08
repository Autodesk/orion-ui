#!/usr/bin/env node
/* eslint-env shelljs */

require('shelljs/global');

const constants = require('./modules/constants');
const knownPaths = require('./modules/known-paths');
const path = require('path');
const program = require('commander');

/**
 * Returns true or false depending on if the provided directoryName has a build
 * directory inside it
 */
function hasBuildDirectory(directoryName) {
  return test('-e',
    path.join(knownPaths.packages, directoryName, constants.buildDirName));
}

/**
 * Copies directoryName/build to root/build/directoryName
 */
function copyToRootBuild(directoryName) {
  console.log(`- copying build from ${directoryName} to the root build`);
  const source = path.join(knownPaths.packages, directoryName, constants.buildDirName);
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

program
  .description('copies build directories from packages to top level build')
  .parse(process.argv);

// Make sure we have a build directory
mkdir('-p', knownPaths.build);

function countTrues(count, bool) {
  return count + (bool) ? 1 : 0;
}

// For each package, check for a build directory and if found, copy it into the
// root build directory
const buildCount = ls(knownPaths.packages).map((directory) => {
  if (hasBuildDirectory(directory)) {
    copyToRootBuild(directory);
    return true;
  }
  return false;
}).reduce(countTrues, 0);

console.log(`${buildCount} builds copied to root`);
