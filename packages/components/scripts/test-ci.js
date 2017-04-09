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

const path = require('path');

cd(path.join(__dirname, '..'));

const codes = [
  'npm run browserify',
  'npm run wct-sauce',
  'node scripts/remap-wct-coverage.js',
  'npm run jest-coverage',
  'node scripts/report-coverage.js',
].map((command) => {
  return exec(command).code;
});

if (codes.filter(c => c === 0).length !== codes.length) {
  process.exit(1);
}
