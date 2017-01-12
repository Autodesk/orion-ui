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

const program = require('commander');
const path = require('path');
const knownPaths = require('./modules/known-paths');
const fs = require('fs');

require('shelljs/global');

function array(val) {
  return val.split(',');
}

program
  .description('builds src to lib for each package')
  .option('-p, --packages [names]', 'Specify the packages to build defaulting to all', array, [])
  .parse(process.argv);


/**
 * Checks if the package name has
 * {
 *   "orion": {
 *     "compile": true
 *   }
 * }
 *
 * In its package.json
 */
function isCompiled(directoryName) {
  const pkgPath = path.join(knownPaths.packages, directoryName, 'package.json');

  // Guard against no package.json
  if (!test('-e', pkgPath)) {
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath));
  return (pkg.orion && pkg.orion.compile);
}

/**
 * Given an array of packageNames (strings) returns a function
 * which checks if the package isCompiled and included in the
 * original array
 */
const specificPackagesFilter = packageNames =>
    packageName =>
      isCompiled(packageName) && packageNames.includes(packageName);

// determine if we're going to look through all packages, or only a specific list
const packageFilter = (program.packages.length === 0) ?
  isCompiled : specificPackagesFilter(program.packages);

/**
 * Given a package name run through a development build using babel-cli
 */
function build(packageName) {
  const srcPath = path.join(knownPaths.packages, packageName, 'src');
  const destPath = path.join(knownPaths.packages, packageName, 'lib');
  const babelPath = path.join(__dirname, 'node_modules', '.bin', 'babel');

  const { code, stdout, stderr } = exec(`NODE_ENV=development ${babelPath} ${srcPath} --out-dir ${destPath} --copy-file`, { silent: true });

  if (code === 0) {
    console.log(`Built ${packageName}`);
  } else {
    console.log(`${packageName}:
      ${stdout && ','}
      ${stderr}`);
  }
}

/**
 * Main program
 *
 * - goes through all packages
 * - filters out packages that are not to be compiled
 * - filters out packages further if --packages is specified on cli (using packageFilter)
 * - builds remaining packages using babel-cli
 */

const packagesToBuild = ls(knownPaths.packages).filter(packageFilter);
packagesToBuild.forEach(packageName => build(packageName));

console.log(`${packagesToBuild.length} packages built`);
