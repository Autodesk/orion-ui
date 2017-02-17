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

const program = require('commander');
const path = require('path');
const knownPaths = require('./modules/known-paths');

require('shelljs/global');

env.NODE_ENV = 'test';

program
  .description('runs specs for each package')
  .option('-s, --sauce', 'Run web component specs remotely on Sauce Labs')
  .option('-r, --report', 'Report coverage to codacy')
  .option('-u, --unit-only', 'Run only unit specs')
  .parse(process.argv);

/**
 * Runs mocha unit specs with istanbul's cli (nyc). Istanbul/NYC config
 * is in .nycrc, specifying report types and files to include/exclude.
 */
function runUnitSpecs() {
  const mochaPath = path.join(knownPaths.root, 'node_modules', '.bin', 'mocha');
  const { code, stdout, stderr } = exec(`nyc ${mochaPath} --colors --compilers js:babel-core/register './packages/!(react-playground)/{,!(node_modules|lib|build)/**/}*.test.js'`);

  console.log('================================================================================');
  if (code === 0) {
    console.log('Non-component specs passed');
  } else {
    console.log(`Non-component specs failed:
      ${stdout && ','}
      ${stderr}`);
    process.exit(code);
  }
  console.log('================================================================================');
}

/**
 * Runs code that will be tested in the component spec suite through
 * babel and browserify so it can be included in the web-component-tester's
 * html-based tests. Files that need to be transpiled are specified
 * in `test/bundle.js`.
 */
function browserify() {
  const browserifyPath = path.join(knownPaths.root, 'node_modules', '.bin', 'browserify');
  const srcPath = path.join(knownPaths.root, 'test', 'bundle.js');
  const destPath = path.join(knownPaths.build, 'bundle.js');

  const { code, stdout, stderr } = exec(`${browserifyPath} ${srcPath} -t [ babelify ] -o ${destPath}`);

  if (code === 0) {
    return;
  }

  console.log(`Transpiling with babel and browserify failed:
    ${stdout && ','}
    ${stderr}`);
  process.exit(code);
}

/**
 * Runs web component tests specified in test/runner.html. JavaScript
 * dependencies for these tests are specified in test/bundle.js and
 * transpiled by `browserify()`.
 */
function runComponentSpecs() {
  console.log('');
  mkdir('-p', knownPaths.build);
  browserify();
  let cmd = 'wct';
  if (program.sauce) {
    cmd = `${cmd} --plugin sauce --skip-plugin local`;
  }

  const { code, stdout, stderr } = exec(cmd);

  console.log('================================================================================');
  if (code === 0) {
    exec(`rm -r ${knownPaths.build}`);
    console.log('Component specs passed');
  } else {
    console.log(`Component specs failed:
      ${stdout && ','}
      ${stderr}`);
    process.exit(code);
  }
  console.log('================================================================================');
}

/**
 * Sends lcov code coverage report generated in `runUnitSpecs`
 * to codacy.
 */
function reportToCodacy() {
  const coverageReport = path.join(knownPaths.coverage, 'lcov.info');
  const codacy = path.join(knownPaths.root, 'node_modules', '.bin', 'codacy-coverage');
  const { code, stdout, stderr } = exec(`cat ${coverageReport} | ${codacy}`);

  if (code === 0) {
    console.log('Reported code coverage to codacy');
  } else {
    console.log(`Coverage reporting failed:
      ${stdout && ','}
      ${stderr}`);
    process.exit(code);
  }
}

/**
 * Main program
 */
runUnitSpecs();

if (!program.unitOnly) {
  runComponentSpecs();
}

if (program.report) {
  reportToCodacy();
}
