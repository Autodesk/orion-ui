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

const expect = require('chai').expect;
const knownPaths = require('./modules/known-paths');
const path = require('path');
require('shelljs/global');

describe('orion-clean', () => {
  const packageBuildPath = path.join(knownPaths.packages, 'test', 'build');
  before(() => {
    mkdir('-p', knownPaths.build);
    mkdir('-p', packageBuildPath);

    const code = exec(`node ${knownPaths.scripts}/orion.js clean`, { silent: true }).code;
    expect(code).to.equal(0);
  });

  it('removes the top level build', () => {
    expect(test('-e', knownPaths.build)).to.equal(false);
  });

  it('removes the build directory from each package', () => {
    expect(test('-e', packageBuildPath)).to.equal(false);
  });
});
