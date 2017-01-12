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
const path = require('path');
const knownPaths = require('./modules/known-paths');
const fs = require('fs');
require('shelljs/global');

describe('orion-ensure-copyright', () => {
  const LICENCE = fs.readFileSync(path.join(knownPaths.root, 'LICENSE')).toString();
  const TEMP_DIR = path.join(knownPaths.root, 'tmp/');

  function createFile(name, includesCopyright) {
    const content = includesCopyright ? `/**\n${LICENCE}*/`.trim() : '';
    fs.writeFileSync(path.join(TEMP_DIR, name), content);
  }

  function runScript() {
    const command = `node ${knownPaths.scripts}/orion.js ensure-copyright --dir ${TEMP_DIR}`;
    return exec(command, { silent: true }).code;
  }

  beforeEach(() => {
    mkdir(TEMP_DIR);
  });

  afterEach(() => {
    rm('-r', TEMP_DIR);
  });

  it('fails if a js file is missing a copyright notice', () => {
    createFile('somefile.js', false);
    const code = runScript();
    expect(code).to.equal(1);
  });

  it('passes if all files have a copyright notice', () => {
    createFile('somefile.js', true);
    const code = runScript();
    expect(code).to.equal(0);
  });

  describe('given a node_modules directory', () => {
    beforeEach(() => {
      const modulePath = path.join(TEMP_DIR, 'node_modules');
      mkdir(modulePath);
      createFile('node_modules/somemodule.js', false);
    });

    it('ignores it', () => {
      const code = runScript();
      expect(code).to.equal(0);
    });
  });
});
