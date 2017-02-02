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
const GitHubApi = require('github');

require('shelljs/global');

const s3 = new AWS.S3();

const TEST_SHA = '90fbcc639f4bc1deab7e99f423e2ccb5639755a9';
const github = new GitHubApi();

describe('orion-deploy', () => {
  afterEach(() => {
    rm('-r', knownPaths.build);
  });

  beforeEach(() => {
    if (!process.env.GITHUB_TOKEN) { return null; }

    // erase any status on sha
    github.authenticate({ type: 'oauth', token: process.env.GITHUB_TOKEN });

    return new Promise((resolve, reject) => {
      github.repos.createStatus({
        sha: TEST_SHA,
        context: 'deployment',
        repo: 'orion',
        owner: 'orion-ui',
        state: 'pending',
        target_url: '',
      }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    }).then(() => {

    });
  });

  it('uploads the top level build directory to s3 and creates a github status', function testWithTimeout() {
    if (!process.env.GITHUB_TOKEN) {
      console.warn(`
WARNING: GitHub credentials not present

Some functional tests will be skipped

To fix:
1. Generate a personal access token
2. Set access token to GITHUB_TOKEN
`);
      return null;
    }

    // mark pending if no AWS creds present
    if (!process.env.AWS_ACCESS_KEY_ID) {
      console.warn(`
WARNING: orion AWS credentials not present

Some functional tests will be skipped

To fix:
1. Ask Cameron (camwest) for AWS credentials
3. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
`);
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
    const code = exec(`
      node ${knownPaths.scripts}/orion.js deploy \
        --build-id=${buildId}                    \
        --gh-token=${process.env.GITHUB_TOKEN}   \
        --gh-sha=${TEST_SHA}                     \
    `, { silent: true }).code;

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
          // Check to make sure the status is created
          github.authenticate({ type: 'oauth', token: process.env.GITHUB_TOKEN });

          github.repos.getStatuses({
            owner: 'orion-ui',
            repo: 'orion',
            ref: TEST_SHA,
          }, (err2, res) => {
            if (err2) {
              reject(err2, err2.stack);
            } else {
              const match = res.find(resItem => resItem.context === 'deployment');

              if (!match) {
                reject('deployment status not found');
              } else {
                expect(match.target_url).to.equal(`https://cdn.web-platform.io/orion-ui/orion/snapshot-${buildId}/index.html`);
                resolve();
              }
            }
          });
        }
      });
    });
  });
});
