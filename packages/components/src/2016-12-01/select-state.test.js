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
    it('is not open', () => {
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

  describe('activated', () => {
    it('sets open to true', () => {
      const result = SelectState.activated({});
      expect(result.open).to.be.true;
    });

    it('focuses on the first option', () => {
      const result = SelectState.activated({});
      expect(result.focussedIndex).to.eq(0);
    });
  });

  describe('optionChosen', () => {
    let state;
    let nextState;
    before(() => {
      state = {
        open: true,
        value: undefined,
        options: [
          { label: 'Red', value: '#F00' },
          { label: 'Green', value: '#0F0' },
          { label: 'Blue', value: '#00F' },
        ],
      };
      nextState = SelectState.optionChosen(state, 1);
    });

    it('sets value to the chosen option', () => {
      expect(nextState.value).to.eq('#0F0');
    });

    it('closes the menu', () => {
      expect(nextState.open).to.be.false;
    });

    context('with an non-existant option index', () => {
      before(() => {
        nextState = SelectState.optionChosen(state, 5);
      });

      it('set value to undefined', () => {
        expect(nextState.value).to.be.undefined;
      });
    });
  });

  describe('deactivated', () => {
    let nextState;
    before(() => {
      nextState = SelectState.deactivated({ open: true });
    });

    it('sets open to false', () => {
      expect(nextState.open).to.be.false;
    });
  });

  describe('focusPrevious', () => {
    context('when closed', () => {
      let nextState;
      before(() => {
        nextState = SelectState.focusPrevious({ open: false });
      });

      it('opens', () => {
        expect(nextState.open).to.be.true;
      });
    });
  });

  describe('focusNext', () => {
    context('when closed', () => {
      let nextState;
      before(() => {
        nextState = SelectState.focusPrevious({ open: false });
      });

      it('opens', () => {
        expect(nextState.open).to.be.true;
      });
    });
  });
});
