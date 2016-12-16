/* eslint-env shelljs */

const expect = require('chai').expect;
const path = require('path');
const knownPaths = require('./modules/known-paths');
const fs = require('fs');

describe.only('orion-ensure-copyright', () => {
  const LICENCE = fs.readFileSync(path.join(knownPaths.root, 'LICENSE')).toString();
  const TEMP_DIR = path.join(knownPaths.root, 'tmp/');

  function createFile(name, includesCopyright) {
    const content = includesCopyright ? `/**\n${LICENCE}*/`.trim() : '';
    fs.writeFileSync(path.join(TEMP_DIR, name), content);
  }

  function runScript() {
    const command = `node orion.js ensure-copyright --dir ${TEMP_DIR}`;
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
