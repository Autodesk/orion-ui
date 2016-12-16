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

const program = require('commander');

program
  .command('clean', 'cleans all build directories')
  .command('compile', 'compile src to lib for each package')
  .command('deploy', 'deploy build directory')
  .command('copy-package-builds', 'copies build directories from packages to top level build')
  .command('ensure-copyright', 'ensures each file has a copyright notice')
  .parse(process.argv);
