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

'use strict';

// Taken from https://github.com/facebook/jest/blob/master/scripts/build.js

require('shelljs/global');

const babel = require('babel-core');
const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const micromatch = require('micromatch');
const path = require('path');
const program = require('commander');

const knownPaths = require('./modules/known-paths');
const getPackages = require('./modules/get-packages');

const SRC_DIR = 'src';
const JS_FILES_PATTERN = '**/*.js';
const IGNORE_PATTERN = '**/*.test.js';
const PACKAGES_DIR = knownPaths.packages;

const babelOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', '.babelrc'), 'utf8')
);
babelOptions.babelrc = false;

program
  .description('builds files with babel')
  .usage('[file ...]')
  .parse(process.argv);

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const files = program.args;

if (files.length) {
  files.forEach(buildFile);
} else {
  process.stdout.write(chalk.bold.inverse('Building packages\n'));
  getPackages().forEach(buildPackage);
  process.stdout.write('\n');
}

function fixedWidth(str) {
  const WIDTH = 80;
  const strs = str.match(new RegExp(`(.{1,${WIDTH}})`, 'g'));
  let lastString = strs[strs.length - 1];
  if (lastString.length < WIDTH) {
    lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'));
  }
  return strs.slice(0, -1).concat(lastString).join('\n');
}

function buildPackage(name) {
  const srcDir = path.resolve(name, SRC_DIR);
  const pattern = path.resolve(srcDir, '**/*');
  const files = glob.sync(pattern, { nodir: true });

  process.stdout.write(fixedWidth(`${path.basename(name)}\n`));

  if (!test('-e', srcDir)) {
    process.stdout.write(`[ ${chalk.grey('SKIP')} ]\n`);
    return;
  }

  files.forEach(f => buildFile(f));

  process.stdout.write(`[  ${chalk.green('OK')}  ]\n`);
}

function buildFile(file, silent = true) {
  const packageName = path.relative(PACKAGES_DIR, file).split(path.sep)[0];
  const packageSrcPath = path.resolve(PACKAGES_DIR, packageName, 'src');
  const packageBuildPath = path.resolve(PACKAGES_DIR, packageName, 'build');
  const relativeToSrcPath = path.relative(packageSrcPath, file);
  const destPath = path.resolve(packageBuildPath, relativeToSrcPath);

  mkdir('-p', path.dirname(destPath));

  if (micromatch.isMatch(file, IGNORE_PATTERN)) {
    silent ||
      process.stdout.write(
        `${chalk.dim('  \u2022 ')}${path.relative(PACKAGES_DIR, file)} (ignore)\n`
      );
  } else if (!micromatch.isMatch(file, JS_FILES_PATTERN)) {
    fs.createReadStream(file).pipe(fs.createWriteStream(destPath));
    silent ||
      process.stdout.write(
        `${chalk.red('  \u2022 ')}${path.relative(PACKAGES_DIR, file)}${chalk.red(' \u21D2 ')}${path.relative(PACKAGES_DIR, destPath)} (copy)\n`
      );
  } else {
    const transformed = babel.transformFileSync(file, babelOptions).code;
    fs.writeFileSync(destPath, transformed);
    silent ||
      process.stdout.write(
        chalk.green('  \u2022 ') +
          path.relative(PACKAGES_DIR, file) +
          chalk.green(' \u21D2 ') +
          path.relative(PACKAGES_DIR, destPath) +
          '\n'
      );
  }
}
