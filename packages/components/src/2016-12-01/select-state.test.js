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
  const options = [
    { label: 'Red', value: '#F00' },
    { label: 'Green', value: '#0F0' },
    { label: 'Blue', value: '#00F' },
  ];

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

    context('without a selectedIndex', () => {
      it('focuses on the first option', () => {
        const result = SelectState.activated({});
        expect(result.focusedIndex).to.eq(0);
      });
    });

    context('with a selectedIndex', () => {
      let state;
      let nextState;
      before(() => {
        state = {
          selectedIndex: 1,
          options,
        };
        nextState = SelectState.activated(state);
      });

      it('sets focus to the selectedIndex', () => {
        expect(nextState.focusedIndex).to.eq(1);
      });
    });
  });

  describe('optionFocused', () => {
    let state;
    let nextState;
    before(() => {
      state = {
        open: true,
        options,
      };
      nextState = SelectState.optionFocused(state, 1);
    });

    it('sets the focusedIndex value', () => {
      expect(nextState.focusedIndex).to.eq(1);
    });
  });

  describe('optionSelected', () => {
    let state;
    let nextState;
    before(() => {
      state = {
        open: true,
        options,
        selectedIndex: 0,
      };
      nextState = SelectState.optionSelected(state, 1);
    });

    it('sets value to the selected option', () => {
      expect(nextState.selectedIndex).to.eq(1);
    });

    it('closes the menu', () => {
      expect(nextState.open).to.be.false;
    });

    context('with an non-existant option index', () => {
      before(() => {
        nextState = SelectState.optionSelected(state, undefined);
      });

      it('does not change the selectedIndex', () => {
        expect(nextState.selectedIndex).to.eq(0);
      });
    });
  });

  describe('deactivated', () => {
    let nextState;
    before(() => {
      nextState = SelectState.deactivated({ open: true, focusedIndex: 1 });
    });

    it('sets open to false', () => {
      expect(nextState.open).to.be.false;
    });

    it('sets focusedIndex to undefined', () => {
      expect(nextState.focusedIndex).to.be.undefined;
    });
  });

  describe('focusPrevious', () => {
    let nextState;
    context('when open', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedIndex: 1,
          options,
        };
        nextState = SelectState.focusPrevious(state);
      });

      it('focuses the next item', () => {
        expect(nextState.focusedIndex).to.eq(0);
      });
    });

    context('when first option has focus', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedIndex: 0,
          options,
        };
        nextState = SelectState.focusPrevious(state);
      });

      it('focuses the last item', () => {
        expect(nextState.focusedIndex).to.eq(2);
      });
    });

    context('when closed', () => {
      before(() => {
        nextState = SelectState.focusPrevious({
          open: false,
          options,
        });
      });

      it('opens the menu', () => {
        expect(nextState.open).to.be.true;
      });

      it('focuses the first item', () => {
        expect(nextState.focusedIndex).to.eq(0);
      });
    });

    context('with a disabled option', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedIndex: 2,
          options: [
            { label: 'Red', value: '#F00' },
            { label: 'Green', value: '#0F0', disabled: true },
            { label: 'Blue', value: '#00F' },
          ],
        };
        nextState = SelectState.focusPrevious(state);
      });

      it('skips it', () => {
        expect(nextState.focusedIndex).to.eq(0);
      });
    });
  });

  describe('focusNext', () => {
    let nextState;
    context('when open', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedIndex: 1,
          options,
        };
        nextState = SelectState.focusNext(state);
      });

      it('focuses the next item', () => {
        expect(nextState.focusedIndex).to.eq(2);
      });
    });

    context('when closed', () => {
      beforeEach(() => {
        const state = {
          open: false,
          focusedIndex: 1,
          options,
        };
        nextState = SelectState.focusNext(state);
      });

      it('opens the menu', () => {
        expect(nextState.open).to.be.true;
      });
    });

    context('when last option has focus', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedIndex: 2,
          options,
        };
        nextState = SelectState.focusNext(state);
      });

      it('focuses the first item', () => {
        expect(nextState.focusedIndex).to.eq(0);
      });
    });

    context('when closed', () => {
      before(() => {
        nextState = SelectState.focusNext({
          open: false,
          focusedIndex: undefined,
          options,
        });
      });

      it('opens', () => {
        expect(nextState.open).to.be.true;
      });

      it('focuses the first item', () => {
        expect(nextState.focusedIndex).to.eq(0);
      });
    });

    context('with a disabled option', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedIndex: 2,
          options: [
            { label: 'Red', value: '#F00', disabled: true },
            { label: 'Green', value: '#0F0' },
            { label: 'Blue', value: '#00F' },
          ],
        };
        nextState = SelectState.focusNext(state);
      });

      it('skips it', () => {
        expect(nextState.focusedIndex).to.eq(1);
      });
    });
  });

  describe('focus', () => {
    it('sets hasFocus to true', () => {
      const nextState = SelectState.focus({ hasFocus: false });
      expect(nextState.hasFocus).to.be.true;
    });
  });

  describe('blur', () => {
    it('sets hasFocus to false', () => {
      const nextState = SelectState.blur({ hasFocus: true });
      expect(nextState.hasFocus).to.be.false;
    });

    it('closes the menu', () => {
      const nextState = SelectState.blur({ hasFocus: true, open: true });
      expect(nextState.open).to.be.false;
    });
  });
});
