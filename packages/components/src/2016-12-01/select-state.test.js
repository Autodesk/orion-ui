/* eslint-env jest */
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
import { expect } from 'chai';

import SelectState from './select-state';

describe('SelectState', () => {
  const options = [
    { label: 'Red', value: '#F00', key: 'a' },
    { label: 'Green', value: '#0F0', key: 'b' },
    { label: 'Blue', value: '#00F', key: 'c' },
  ];

  describe('getInitialState', () => {
    it('is not open', () => {
      const initialState = SelectState.getInitialState();
      expect(initialState.open).to.be.false;
    });

    describe('with a state', () => {
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

    describe('without a selectedKey', () => {
      it('focuses on the first selectable option', () => {
        const opts = [
          { label: 'Red', value: '#F00', key: 'a', disabled: true },
          { label: 'Green', value: '#0F0', key: 'b' },
          { label: 'Blue', value: '#00F', key: 'c' },
        ];
        const result = SelectState.activated({ options: opts });
        expect(result.focusedKey).to.eq('b');
      });
    });

    describe('with a selectedKey', () => {
      let state;
      let nextState;
      beforeAll(() => {
        state = {
          selectedKey: 'b',
          options,
        };
        nextState = SelectState.activated(state);
      });

      it('sets focus to the selectedKey', () => {
        expect(nextState.focusedKey).to.eq('b');
      });
    });
  });

  describe('optionFocused', () => {
    let state;
    let nextState;

    describe('with a valid option', () => {
      beforeEach(() => {
        state = {
          open: true,
          options,
        };
        nextState = SelectState.optionFocused(state, 'b');
      });

      it('sets the focusedKey value', () => {
        expect(nextState.focusedKey).to.eq('b');
      });
    });

    describe('with a disabled option', () => {
      beforeEach(() => {
        state = {
          open: true,
          options: [
            { label: 'Red', value: '#F00', key: 'a' },
            { label: 'Green', value: '#0F0', key: 'b', disabled: true },
            { label: 'Blue', value: '#00F', key: 'c' },
          ],
        };
        nextState = SelectState.optionFocused(state, 'b');
      });

      it('sets focusedKey to undefined', () => {
        expect(nextState.focusedKey).to.be.undefined;
      });
    });
  });

  describe('optionSelected', () => {
    let state;
    let nextState;
    beforeAll(() => {
      state = {
        open: true,
        options,
        selectedKey: 'a',
        filter: 'foo',
      };
      nextState = SelectState.optionSelected(state, 'b');
    });

    it('sets value to the selected option', () => {
      expect(nextState.selectedKey).to.eq('b');
    });

    it('closes the menu', () => {
      expect(nextState.open).to.be.false;
    });

    it('clears the filter', () => {
      expect(nextState.filter).to.eq(undefined);
    });

    describe('with an non-existant option key', () => {
      beforeAll(() => {
        nextState = SelectState.optionSelected(state, undefined);
      });

      it('does not change the selectedKey', () => {
        expect(nextState.selectedKey).to.eq('a');
      });
    });
  });

  describe('deactivated', () => {
    let nextState;
    beforeAll(() => {
      nextState = SelectState.deactivated({ open: true, focusedKey: 'b', filter: 'foo' });
    });

    it('sets open to false', () => {
      expect(nextState.open).to.be.false;
    });

    it('sets focusedKey to undefined', () => {
      expect(nextState.focusedKey).to.be.undefined;
    });

    it('clears the filter', () => {
      expect(nextState.filter).to.eq(undefined);
    });
  });

  describe('focusPrevious', () => {
    let nextState;
    describe('when open', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedKey: 'b',
          options,
        };
        nextState = SelectState.focusPrevious(state);
      });

      it('focuses the next item', () => {
        expect(nextState.focusedKey).to.eq('a');
      });
    });

    describe('when first option has focus', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedKey: 'a',
          options,
        };
        nextState = SelectState.focusPrevious(state);
      });

      it('focuses the last item', () => {
        expect(nextState.focusedKey).to.eq('c');
      });
    });

    describe('when closed', () => {
      beforeAll(() => {
        nextState = SelectState.focusPrevious({
          open: false,
          options,
        });
      });

      it('opens the menu', () => {
        expect(nextState.open).to.be.true;
      });

      it('focuses the first item', () => {
        expect(nextState.focusedKey).to.eq('a');
      });
    });

    describe('with a disabled option', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedKey: 'c',
          options: [
            { label: 'Red', value: '#F00', key: 'a' },
            { label: 'Green', value: '#0F0', key: 'b', disabled: true },
            { label: 'Blue', value: '#00F', key: 'c' },
          ],
        };
        nextState = SelectState.focusPrevious(state);
      });

      it('skips it', () => {
        expect(nextState.focusedKey).to.eq('a');
      });
    });
  });

  describe('focusNext', () => {
    let nextState;
    describe('when open', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedKey: 'b',
          options,
        };
        nextState = SelectState.focusNext(state);
      });

      it('focuses the next item', () => {
        expect(nextState.focusedKey).to.eq('c');
      });
    });

    describe('when closed', () => {
      beforeEach(() => {
        const state = {
          open: false,
          focusedKey: 'b',
          options,
        };
        nextState = SelectState.focusNext(state);
      });

      it('opens the menu', () => {
        expect(nextState.open).to.be.true;
      });
    });

    describe('when last option has focus', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedKey: 'c',
          options,
        };
        nextState = SelectState.focusNext(state);
      });

      it('focuses the first item', () => {
        expect(nextState.focusedKey).to.eq('a');
      });
    });

    describe('when closed', () => {
      beforeAll(() => {
        nextState = SelectState.focusNext({
          open: false,
          focusedKey: undefined,
          options,
        });
      });

      it('opens', () => {
        expect(nextState.open).to.be.true;
      });

      it('focuses the first item', () => {
        expect(nextState.focusedKey).to.eq('a');
      });
    });

    describe('with a disabled option', () => {
      beforeEach(() => {
        const state = {
          open: true,
          focusedKey: 'c',
          options: [
            { label: 'Red', value: '#F00', key: 'a', disabled: true },
            { label: 'Green', value: '#0F0', key: 'b' },
            { label: 'Blue', value: '#00F', key: 'c' },
          ],
        };
        nextState = SelectState.focusNext(state);
      });

      it('skips it', () => {
        expect(nextState.focusedKey).to.eq('b');
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

    it('clears the filter', () => {
      const nextState = SelectState.blur({ filter: 'foo' });
      expect(nextState.filter).to.eq(undefined);
    });
  });

  describe('filteredOptions', () => {
    let filteredOptions;

    describe('matching one option', () => {
      beforeEach(() => {
        filteredOptions = SelectState.filteredOptions({ options, filter: 'gr' });
      });

      it('sets filteredOptions to the matching option', () => {
        expect(filteredOptions.length).to.eq(1);
        expect(filteredOptions[0].label).to.eq('Green');
      });
    });

    describe('matching no options', () => {
      beforeEach(() => {
        filteredOptions = SelectState.filteredOptions({ options, filter: 'growlith' });
      });

      it('sets filteredOptions to an empty array', () => {
        expect(filteredOptions.length).to.eq(0);
      });
    });

    describe('with empty string', () => {
      beforeEach(() => {
        filteredOptions = SelectState.filteredOptions({ options, filter: '' });
      });

      it('sets filteredOptions to all options', () => {
        expect(filteredOptions.length).to.eq(3);
      });
    });

    describe('with undefined', () => {
      beforeEach(() => {
        filteredOptions = SelectState.filteredOptions({ options, filter: undefined });
      });

      it('sets filteredOptions to all options', () => {
        expect(filteredOptions.length).to.eq(3);
      });
    });
  });

  describe('filter', () => {
    let nextState;

    it('sets the filter', () => {
      nextState = SelectState.filter({ options }, 'foo');
      expect(nextState.filter).to.eq('foo');
    });

    it('opens the menu', () => {
      nextState = SelectState.filter({ options }, 'foo');
      expect(nextState.open).to.eq(true);
    });
  });

  describe('clearSelection', () => {
    let nextState;

    beforeEach(() => {
      const state = {
        selectedIndex: 1,
        selectedKey: 'a',
      };
      nextState = SelectState.clearSelection(state);
    });

    it('clears the selectedKey and selectedIndex', () => {
      expect(nextState.selectedIndex).to.eq(-1);
      expect(nextState.selectedKey).to.be.undefined;
    });
  });
});
