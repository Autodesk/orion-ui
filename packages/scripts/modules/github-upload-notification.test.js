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
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('GithubUploadNotification', () => {
  let GithubUploadNotification;
  let fakeGithubInstance;

  beforeEach(() => {
    class FakeGithub {
      constructor() {
        fakeGithubInstance = this;

        this.authenticate = sinon.stub();

        this.repos = {
          createStatus: sinon.stub(),
        };
      }
    }

    GithubUploadNotification = proxyquire('./github-upload-notification', {
      github: FakeGithub,
    });
  });

  describe('constructor', () => {
    it('throws if the token and sha are not set', () => {
      expect(() => {
        new GithubUploadNotification(null, null); // eslint-disable-line no-new
      }).to.throw(/token, sha are required arguments/);
    });

    it('does not throw if the token and sha are set', () => {
      expect(() => {
        new GithubUploadNotification('token', 'sha'); // eslint-disable-line no-new
      }).not.to.throw(new Error('token, sha are required arguments'));
    });
  });

  describe('createStatus', () => {
    describe('when the status is created with a custom state, description, and targetUrl', () => {
      let actualStatus;

      const props = {
        state: 'my-state',
        description: 'my-description',
        targetUrl: 'my-target-url',
      };

      beforeEach(() => {
        const github = new GithubUploadNotification('token', 'sha');

        github.createStatus(props);

        actualStatus = fakeGithubInstance.repos.createStatus.getCall(0).args[0];
      });

      it('passes state createStatus', () => {
        expect(actualStatus.state).to.equal(props.state);
      });

      it('passes description to createStatus', () => {
        expect(actualStatus.description).to.equal(props.description);
      });

      it('passes targetUrl to createStatus as target_url', () => {
        expect(actualStatus.target_url).to.equal(props.targetUrl);
      });
    });

    describe('when the status is successful with defaults', () => {
      let actualAuth;
      let actualStatus;
      let actualCallback;
      let actualPromise;

      const fakeToken = sinon.stub();
      const fakeSha = sinon.stub();

      beforeEach(() => {
        const github = new GithubUploadNotification(fakeToken, fakeSha);

        actualPromise = github.createStatus();
        actualAuth = fakeGithubInstance.authenticate.getCall(0).args[0];
        actualStatus = fakeGithubInstance.repos.createStatus.getCall(0).args[0];
        actualCallback = fakeGithubInstance.repos.createStatus.getCall(0).args[1];
      });

      it('authenticates with oauth type', () => {
        expect(actualAuth.type).to.equal('oauth');
      });

      it('sets the token to the constructor token', () => {
        expect(actualAuth.token).to.equal(fakeToken);
      });

      it('sets the context to deployment', () => {
        expect(actualStatus.context).to.equal('deployment');
      });

      it('sets the repo to orion', () => {
        expect(actualStatus.repo).to.equal('orion');
      });

      it('sets the user to orion-ui', () => {
        expect(actualStatus.url).to.equal('orion-ui');
      });

      it('sets the description to default: empty string', () => {
        expect(actualStatus.description).to.equal('');
      });

      it('sets the sha to the constructor sha', () => {
        expect(actualStatus.sha).to.equal(fakeSha);
      });

      it('sets the state to the default: pending', () => {
        expect(actualStatus.state).to.equal('pending');
      });

      it('sets the target_url to default: empty string', () => {
        expect(actualStatus.target_url).to.equal('');
      });

      it('resolves the returned promise', () => {
        return new Promise((resolve) => {
          actualPromise.then(() => {
            resolve();
          });

          actualCallback(null);
        });
      });
    });

    describe('when the status errors', () => {
      it('rejects the promise with the error message', () => {
        const github = new GithubUploadNotification('token', 'sha');

        const actualPromise = github.createStatus();
        const actualCallback = fakeGithubInstance.repos.createStatus.getCall(0).args[1];

        const fakeError = sinon.stub();

        return new Promise((resolve) => {
          actualPromise.catch((err) => {
            expect(err).to.equal(fakeError);
            resolve();
          });

          actualCallback(fakeError);
        });
      });
    });
  });

  describe('startDeploy', () => {
    it('creates a status with pending state and deploying description', () => {
      const github = new GithubUploadNotification('token', 'sha');

      github.createStatus = sinon.stub();

      github.startDeploy();

      expect(github.createStatus.calledWith({
        state: 'pending',
        description: 'deploying',
      })).to.equal(true);
    });
  });

  describe('finishDeploy', () => {
    it('creates a status with success state, deployed description and the targetUrl', () => {
      const exampleUrl = 'http://example.com';

      const github = new GithubUploadNotification('token', 'sha');

      github.createStatus = sinon.stub();

      github.finishDeploy(exampleUrl);

      expect(github.createStatus.calledWith({
        status: 'success',
        description: 'deployed',
        targetUrl: exampleUrl,
      })).to.equal(true);
    });
  });
});
