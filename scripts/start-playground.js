#!/usr/bin/env node
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

const [name] = program.args;

if (name) {
  startPlayground(name);
} else {
  if (program.list) {
    outputList();
  } else {
    console.error('playground name is required');
    outputList();
    program.outputHelp();
    process.exit(1);
  }
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

function isValidPlayground(name) {
  return getPlaygrounds().find(playground => playground === name);
}

function getPlaygrounds() {
  return ls(knownPaths.packages)
    .filter(package => package.match(/playground/))
}

function outputList() {
  console.log();
  console.log('Playgrounds: ');
  console.log();
  const playgrounds = getPlaygrounds();
  playgrounds.forEach(outputListItem);
}

function outputListItem(item) {
  console.log(`- ${item}`);
}