/* eslint-env shelljs */

const expect = require('chai').expect;
const knownPaths = require('./modules/known-paths');
const path = require('path');

require('shelljs/global');

describe('orion-clean', () => {
  const packageBuildPath = path.join(knownPaths.packages, 'test', 'build');
  before(() => {
    mkdir('-p', knownPaths.build);
    mkdir('-p', packageBuildPath);

    expect(
        exec('node orion.js clean', { silent: true }).code
    ).to.equal(0);
  });

  it('removes the top level build', () => {
    expect(test('-e', knownPaths.build)).to.equal(false);
  });

  it('removes the build directory from each package', () => {
    expect(test('-e', packageBuildPath)).to.equal(false);
  });
});
