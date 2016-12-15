/* eslint-env shelljs */

const expect = require('chai').expect;
const path = require('path');
const knownPaths = require('./modules/known-paths');
const fs = require('fs');

describe('orion-ensure-copyright', () => {
  const copyright = fs.readFileSync('copyright.txt').toString();

  function createFile(name, includesCopyright) {
    const content = includesCopyright ? copyright : '';
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
    const code = exec(`node orion.js ensure-copyright ${knownPaths.tmp}`, { silent: true }).code;
    expect(code).to.equal(1);
  });

  it('passes if all files have a copyright notice', () => {
    createFile('somefile.js', true);
    const code = exec(`node orion.js ensure-copyright ${knownPaths.tmp}`, { silent: true }).code;
    expect(code).to.equal(0);
  });

  describe('with the --fix flag', () => {
    it('adds the copyright notice');
  });
});
