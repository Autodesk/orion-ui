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

  beforeEach(() => {
    mkdir(knownPaths.tmp);
  });

  afterEach(() => {
    rm('-r', knownPaths.tmp);
  });

  it('fails if a js file is missing a copyright notice', () => {
    createFile('somefile.js', false);
    const code = exec(`node orion.js ensure-copyright --dir ${knownPaths.tmp}`, { silent: true }).code;
    expect(code).to.equal(1);
  });

  it('passes if all files have a copyright notice', () => {
    createFile('somefile.js', true);
    const code = exec(`node orion.js ensure-copyright --dir ${knownPaths.tmp}`, { silent: true }).code;
    expect(code).to.equal(0);
  });

  describe('with the --fix flag', () => {
    it('adds the copyright notice');
  });

  describe('given a node_mdules directory', () => {
    it('ignores it');
  })
});
