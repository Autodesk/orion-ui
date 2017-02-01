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

describe('orion-set-package-builds-to-root', () => {
  const packageName = 'my-valid-test-package';
  const source = path.join(knownPaths.build, packageName);
  const destination = path.join(knownPaths.build, 'dummy.txt');

  beforeEach(() => {
    // Make the source path and build path
    mkdir('-p', source);
    mkdir('-p', knownPaths.build);

    // Put a dummy file in there
    touch(path.join(source, 'dummy.txt'));

    // Make sure the files doesn't exist at the destination
    if (test('-e', destination)) {
      rm('-R', destination);
    }
  });

  afterEach(() => {
    // Cleanup
    rm('-R', knownPaths.build);
  });

  it('errors when an unknown package is provided', () => {
    // Run the command
    const result = exec(`node ${knownPaths.scripts}/orion.js set-package-to-root -p some-random-package`, { silent: true });
    const code = result.code;
    const error = result.stderr;

    expect(error).to.match(/some-random-package was not found/);
    expect(code).to.equal(1);
  });

  it('copies the built contents when a known package is provided', () => {
    const result = exec(`node ${knownPaths.scripts}/orion.js set-package-to-root -p ${packageName}`, { silent: true });
    const code = result.code;

    expect(code).to.equal(0);
    expect(test('-e', destination)).to.equal(true);
  });
});
