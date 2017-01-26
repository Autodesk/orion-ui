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

const PopoverState = require('./popover-state.js');

describe('PopoverState', () => {
  describe('getInitialState', () => {
    it('is not open', () => {
      const initialState = PopoverState.getInitialState();
      expect(initialState.open).to.be.false;
    });

    context('with a state', () => {
      it('extends default state with passed state', () => {
        const initialState = PopoverState.getInitialState({ open: true });
        expect(initialState.open).to.be.true;
      });
    });
  });

  describe('clickedOutside', () => {
    let nextState;
    before(() => {
      nextState = PopoverState.clickedOutside({ open: true });
    });

    it('sets open to false', () => {
      expect(nextState.open).to.be.false;
    });
  });
});
