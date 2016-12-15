/* eslint-env shelljs */

const expect = require('chai').expect;
const knownPaths = require('./modules/known-paths');
const path = require('path');

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
    const code = exec('node orion.js copy-package-builds', { silent: true }).code;
    expect(code).to.equal(0);

    // Test that the destination path has been created properly
    expect(test('-e', destination)).to.equal(true);
  });
});
