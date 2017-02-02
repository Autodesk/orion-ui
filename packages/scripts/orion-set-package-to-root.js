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

require('shelljs/global');

const knownPaths = require('./modules/known-paths');
const path = require('path');
const program = require('commander');

program
  .description('copies contents of  :build/:packageName to :build')
  .option('-p, --package [name]', 'The name of the package to copy')
  .parse(process.argv);

if (!program.package) {
  console.error('package is required');
  program.outputHelp();
  process.exit(1);
}

const source = path.join(knownPaths.build, program.package);

if (!test('-e', source)) {
  console.error();
  console.error(`${program.package} was not found in ${knownPaths.build}`);
  console.error('Maybe run copy-package-builds first?');
  console.error();

  process.exit(1);
}

console.log(`Copying contents of ${program.package} to ${knownPaths.build}`);
cp('-R', `${source}/*`, knownPaths.build);

console.log(`Removing ${source}`);
rm('-rf', source);
