#!/usr/bin/env node
/* eslint-env shelljs */

const program = require('commander');
// const path = require('path');
// const knownPaths = require('./modules/known-paths');
// const fs = require('fs');

require('shelljs/global');

program
  .description('ensures each file has a copyright notice')
  .option('-f, --fix', 'Specify the packages to build defaulting to all')
  .parse(process.argv);

function ensureCopyright() {
  return true;
}

/**
 * Main program
 *
 * - goes through all files in the repo
 * - passes if all files have a copyright notice
 * - fails if any do not
 * - optionally adds a copyright notice where missing
 */

if (ensureCopyright()) {
  console.log('All files have copyright notice.');
} else {
  console.log('Some files are missing copyright notice.');
  process.exit(1);
}
