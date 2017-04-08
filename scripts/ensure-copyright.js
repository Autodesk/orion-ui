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
const glob = require('glob');

require('shelljs/global');

const LICENCE = fs.readFileSync(path.join(knownPaths.root, 'LICENSE')).toString();

program
  .description('ensures each file has a copyright notice')
  .option('--dir <dir>', 'Directory within which to ensure copyright notices are present')
  .option('--fix', 'Specify the packages to build defaulting to all')
  .parse(process.argv);

if (!program.dir) {
  console.error('Error missing dir');
  program.outputHelp();
}

function reportResult(result) {
  if (result.fail.length === 0) {
    console.log('All files have copyright notices.');
  } else {
    console.log('The following files are missing copyright notices:');
    console.log(result.fail.join('\n'));
    process.exit(1);
  }
}

function hasCopyrightNotice(file) {
  const fileContent = fs.readFileSync(file).toString();
  return fileContent.indexOf(LICENCE) !== -1;
}

function ensureCopyright(dir) {
  const files = glob.sync(path.join(dir, '**/*.{js,ts}'), { ignore: ['**/*.d.ts', '**/node_modules/**', '**/bower_components/**', '**/coverage/**', '**/examples/**', '**/vendor/**', 'gemini-report/**'] });
  const result = files.reduce((memo, file) => {
    if (hasCopyrightNotice(file)) {
      memo.pass.push(file);
    } else {
      memo.fail.push(file);
    }
    return memo;
  }, { pass: [], fail: [] });
  reportResult(result);
}

/**
 * Main program
 *
 * - goes through all files in the repo
 * - passes if all files have a copyright notice
 * - fails if any do not
 * - optionally adds a copyright notice where missing
 */

ensureCopyright(program.dir);
