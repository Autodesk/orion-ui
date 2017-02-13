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
const eventKey = require('./event-key');
const chai = require('chai');

const expect = chai.expect;

describe('Utils.eventKey', () => {
  let event;

  context('with a keyCode', () => {
    beforeEach(() => {
      event = { keyCode: 37 };
    });

    it('returns the standards-compliant key', () => {
      expect(eventKey(event)).to.eq('ArrowLeft');
    });
  });

  context('with a standards-compliant key', () => {
    beforeEach(() => {
      event = { key: 'ArrowLeft' };
    });

    it('returns the standards-compliant key', () => {
      expect(eventKey(event)).to.eq('ArrowLeft');
    });
  });

  context('with a key from Edge', () => {
    beforeEach(() => {
      event = { key: 'Left' };
    });

    it('returns the standards-compliant key', () => {
      expect(eventKey(event)).to.eq('ArrowLeft');
    });
  });

  context('with an unsupported key', () => {
    beforeEach(() => {
      event = { keyCode: 100 };
    });

    it('returns null', () => {
      expect(eventKey(event)).to.be.null; // eslint-disable-line no-unused-expressions
    });
  });
});
