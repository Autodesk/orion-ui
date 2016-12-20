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

const AWS = require('aws-sdk');
const deployConfig = require('./modules/deploy-config');
const expect = require('chai').expect;
const knownPaths = require('./modules/known-paths');
const path = require('path');
const uuid = require('uuid/v1');

const s3 = new AWS.S3();

describe('orion-deploy', () => {
  afterEach(() => {
    rm('-r', knownPaths.build);
  });

  it('uploads the top level build directory to s3', function testWithTimeout() {
    // mark pending if no AWS creds present
    if (!process.env.AWS_ACCESS_KEY_ID) {
      console.log('Skipping orion-deploy.test.js - No AWS credencials set.');
      return null;
    }

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
