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

describe('orion-package-builds', () => {
  const source = path.join(knownPaths.packages, 'test', 'build', 'sub-directory');
  const destination = path.join(knownPaths.build, 'test', 'sub-directory');

  beforeEach(() => {
    // Make the source path
    mkdir('-p', source);

    // Put a dummy file in there
    touch(path.join(source, 'dummy.txt'));

    // Make sure the build path doesn't already exist
    if (test('-e', knownPaths.build)) {
      rm('-R', knownPaths.build);
    }
  });

  afterEach(() => {
    // Clean up source & destination
    rm('-R', path.join(knownPaths.packages, 'test'));
    rm('-R', knownPaths.build);
  });

  it('copies build directories for packages into root build directory', () => {
    // Run the command
    const code = exec(`node ${knownPaths.scripts}/orion.js copy-package-builds`, { silent: true }).code;
    expect(code).to.equal(0);

    // Test that the destination path has been created properly
    expect(test('-e', destination)).to.equal(true);
  });
});
