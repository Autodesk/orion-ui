/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
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
const chai = require('chai');

const expect = chai.expect;

const SelectState = require('./select-state.js');

describe('SelectState', () => {
  describe('getInitialState', () => {
    it('returns a default state', () => {
      const initialState = SelectState.getInitialState();
      expect(initialState.open).to.be.false;
    });

    context('with a state', () => {
      it('extends default state with passed state', () => {
        const initialState = SelectState.getInitialState({ open: true });
        expect(initialState.open).to.be.true;
      });
    });
  });

  describe('enterOpen', () => {
    it('sets open to true', () => {
      const result = SelectState.enterOpen({});
      expect(result.open).to.be.true;
    });
  });

  describe('leaveOpen', () => {
    it('sets open to false', () => {
      const result = SelectState.leaveOpen({ open: true });
      expect(result.open).to.be.false;
    });
  });
});
