#!/usr/bin/env node
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
/* eslint-env shelljs */
require('shelljs/global');

const knownPaths = require('./modules/known-paths');
const path = require('path');
const program = require('commander');

program
  .description('start up a playground development environment')
  .usage('[options] [name]')
  .option('-l, --list', 'list all playgrounds')
  .parse(process.argv);

function getPlaygrounds() {
  return ls(knownPaths.packages)
    .filter(pkg => pkg.match(/playground/));
}

function isValidPlayground(name) {
  return getPlaygrounds().find(playground => playground === name);
}

function outputListItem(item) {
  console.log(`- ${item}`);
}

function outputList() {
  console.log();
  console.log('Playgrounds: ');
  console.log();
  const playgrounds = getPlaygrounds();
  playgrounds.forEach(outputListItem);
}

function startPlayground(name) {
  if (!isValidPlayground(name)) {
    console.error('A valid playground name is required');
    outputList();
    program.outputHelp();
    process.exit(1);
  } else {
    console.log(`start ${name}`);

    // Verify we are in root
    cd(path.join(__dirname, '..'));
    exec(`./node_modules/.bin/lerna run start --scope ${name} --include-filtered-dependencies --no-sort --stream`);
  }
}

const [name] = program.args;

if (name) {
  startPlayground(name);
} else if (program.list) {
  outputList();
} else {
  console.error('playground name is required');
  outputList();
  program.outputHelp();
  process.exit(1);
}
