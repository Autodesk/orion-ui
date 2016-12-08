/* eslint-env shelljs */

const AWS = require('aws-sdk');
const deployConfig = require('./modules/deploy-config');
const expect = require('chai').expect;
const knownPaths = require('./modules/known-paths');
const path = require('path');
const uuid = require('uuid/v1');

const s3 = new AWS.S3();
require('shelljs/global');

describe('orion-deploy', () => {
  afterEach(() => {
    rm('-R', knownPaths.build);
  });

  it('uploads the top level build directory to s3', function testWithTimeout() {
    // uploading sometimes is slow
    this.timeout(5000);

    // delete build dir if it exists
    if (test('-e', knownPaths.build)) {
      rm('-R', knownPaths.build);
    }

    // Create test file
    mkdir('-p', knownPaths.build);
    touch(path.join(knownPaths.build, 'test.txt'));

    // Use a uuid so we know the build isn't already uploaded
    const buildId = `test-${uuid()}`;

    // Do the deploy
    const code = exec(`node orion.js deploy --build-id=${buildId}`, { silent: true }).code;
    expect(code).to.equal(0);

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: deployConfig.Bucket,
        Key: `${deployConfig.SnapshotPrefix(buildId)}/test.txt`,
      };

      // Check to make sure the file exists
      s3.headObject(params, (err) => {
        if (err) {
          reject(err, err.stack);
        } else {
          resolve();
        }
      });
    });
  });
});
