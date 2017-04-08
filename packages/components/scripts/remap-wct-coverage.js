/* eslint-env shelljs */
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
