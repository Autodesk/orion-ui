/* eslint-env shelljs */

const expect = require('chai').expect;
const path = require('path');
const knownPaths = require('./modules/known-paths');
const fs = require('fs');

describe.only('orion-ensure-copyright', () => {
  const LICENCE = fs.readFileSync(path.join(knownPaths.root, 'LICENSE')).toString();

  function createFile(name, includesCopyright) {
    const content = includesCopyright ? `/**\n${LICENCE}*/`.trim() : '';
    fs.writeFileSync(path.join(knownPaths.tmp, name), content);
  }

  function runScript() {
    const command = `node orion.js ensure-copyright --dir ${knownPaths.tmp}`;
    return exec(command, { silent: true }).code;
  }

  beforeEach(() => {
    mkdir(knownPaths.tmp);
  });

  afterEach(() => {
    rm('-r', knownPaths.tmp);
  });

  it('fails if a js file is missing a copyright notice', () => {
    createFile('somefile.js');
    const code = runScript();
    expect(code).to.equal(1);
  });

  it('passes if all files have a copyright notice', () => {
    createFile('somefile.js');
    const code = runScript();
    expect(code).to.equal(0);
  });

  describe('given a node_modules directory', () => {
    beforeEach(() => {
      const modulePath = path.join(knownPaths.tmp, 'node_modules');
      mkdir(modulePath);
      createFile('node_modules/somemodule.js');
    });

    it('ignores it', () => {
      const code = runScript();
      expect(code).to.equal(0);
    });
  });
});
