#!/usr/bin/env node
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

const GitHubApi = require('github');

/**
 * Creates an uploading status for a GitHub commit. A 'pending' status is created
 * asynchronusly when this class is instanced
 *
 * @param token - GitHub access token with repo:status scope
 * @param sha - The SHA1 of the commit being tested
 */
class GithubUploadNotification {
  constructor(token, sha) {
    this.sha = sha;
    this.token = token;

    const errors = [];

    if (!token) {
      errors.push('token');
    }

    if (!sha) {
      errors.push('sha');
    }

    if (errors.length) {
      throw new Error(`${errors.join(', ')} are required arguments`);
    }

    this.github = new GitHubApi();
  }

  /**
   * Creates a github.repos.createStatus and returns a promise which resolves
   * when the status is created on the server
   *
   * @param config.state - The state of the status. Can be one of pending,
   *                       success, error, or failure.
   * @param config.description - A short description of the status.
   * @param config.targetUrl - The target URL to associate with this status.
   */
  createStatus(props = {}) {
    const state = props.state || 'pending';
    const description = props.description || '';
    const targetUrl = props.targetUrl || '';

    return new Promise((resolve, reject) => {
      this.github.authenticate({ type: 'oauth', token: this.token });

      const status = {
        context: 'deployment',
        repo: 'orion',
        owner: 'orion-ui',
        description,
        sha: this.sha,
        state,
        target_url: targetUrl
      };

      this.github.repos.createStatus(status, err => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  /**
   * Sets the status to pending
   */
  startDeploy() {
    return this.createStatus({
      state: 'pending',
      description: 'deploying'
    });
  }

  /**
   * Sets the status to success and sets the url
   *
   * @url - the url to be set on the github status
   */
  finishDeploy(targetUrl) {
    return this.createStatus({
      state: 'success',
      description: 'deployed',
      targetUrl
    });
  }
}

module.exports = GithubUploadNotification;
