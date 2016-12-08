#!/usr/bin/env node

const program = require('commander');

program
  .command('clean', 'cleans all build directories')
  .command('deploy', 'deploy build directory')
  .command('copy-package-builds', 'copies build directories from packages to top level build')
  .parse(process.argv);
