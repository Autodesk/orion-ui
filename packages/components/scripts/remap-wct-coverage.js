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

const { Collector } = require('istanbul');

const path = require('path');

cd(path.join(__dirname, '..'));

const loadCoverage = require('remap-istanbul/lib/loadCoverage');
const remap = require('remap-istanbul/lib/remap');
const writeReport = require('remap-istanbul/lib/writeReport');

const wctCoverage = path.join(__dirname, '..', 'coverage', 'wct', 'coverage-final.json');
const coverage = loadCoverage(wctCoverage);

const collector = remap(coverage);

const newCollector = new Collector();

/**
 * Manually filter some stuff out!
 */
collector.files().forEach((f) => {
  if (f.match(/^src\//)) {
    newCollector.add({
      [path.resolve(f)]: Object.assign({}, collector.fileCoverageFor(f), {
        path: path.resolve(f),
      }),
    });
  }
});

writeReport(newCollector, 'json', {}, wctCoverage);
writeReport(newCollector, 'html', {}, path.join(path.dirname(wctCoverage), 'lcov-report'));
