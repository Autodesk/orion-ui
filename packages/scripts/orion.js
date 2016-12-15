#!/usr/bin/env node

const program = require('commander');

program
  .command('clean', 'cleans all build directories')
  .command('compile', 'compile src to lib for each package')
  .command('deploy', 'deploy build directory')
  .command('copy-package-builds', 'copies build directories from packages to top level build')
  .command('ensure-copyright', 'ensures each file has a copyright notice')
  .parse(process.argv);
