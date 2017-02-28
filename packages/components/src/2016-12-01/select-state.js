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
const SelectState = {
  getInitialState(state) {
    return {
      open: false,
      ...state,
    };
  },

  toggleOpen(state) {
    if (state.open) {
      return this.deactivated(state);
    }
    return this.activated(state);
  },

  activated(state) {
    let focusedKey = state.selectedKey;
    if (focusedKey === undefined) {
      focusedKey = this._firstFocusableKey(state.options);
    }

    return {
      ...state,
      focusedKey,
      open: true,
    };
  },

  optionFocused(state, focusedKey) {
    const focusedOption = state.options.find(o => o.key === focusedKey);
    if (focusedOption.disabled) {
      focusedKey = undefined;
    }

    return {
      ...state,
      focusedKey,
    };
  },

  optionSelected(state, selectedKey) {
    let nextSelectedKey = selectedKey;
    if (nextSelectedKey === undefined) { nextSelectedKey = state.selectedKey; }

    const option = state.options.find(o => o.key === nextSelectedKey);
    let selectedIndex;
    if (option) { selectedIndex = state.options.indexOf(option); }

    return {
      ...state,
      selectedKey: nextSelectedKey,
      selectedIndex,
      open: false,
    };
  },

  deactivated(state) {
    return {
      ...state,
      open: false,
      focusedKey: undefined,
    };
  },

  focusPrevious(state) {
    if (!state.open) { return this.activated(state); }
    if (state.focusedKey === undefined) { return this._firstFocusableKey(state.options); }

    const focusedKey = this._nextFocusableKey(
      state.focusedKey,
      state.options,
      (index, options) => {
        index -= 1;
        if (index < 0) { index = options.length - 1; }
        return index;
      },
    );

    return {
      ...state,
      focusedKey,
    };
  },

  focusNext(state) {
    if (!state.open) { return this.activated(state); }
    if (state.focusedKey === undefined) { return this._firstFocusableKey(state.options); }

    const focusedKey = this._nextFocusableKey(
      state.focusedKey,
      state.options,
      (index, options) => {
        index += 1;
        if (index > options.length - 1) {
          index = 0;
        }
        return index;
      },
    );

    return {
      ...state,
      focusedKey,
    };
  },

  _nextFocusableKey(initialKey, options, step) {
    const initialOption = options.find(o => o.key === initialKey);
    let index = options.indexOf(initialOption);
    for (let i = 0; i < options.length; i += 1) {
      index = step(index, options);
      const option = options[index];
      if (!option.disabled) { return option.key; }
    }
    return options[0].key;
  },

  _firstFocusableKey(options) {
    if (options === undefined) { options = []; }
    const firstfocusableOption = options.find(option => !option.disabled);
    let key;
    if (firstfocusableOption) { key = firstfocusableOption.key; }
    return key;
  },

  focus(state) {
    return {
      ...state,
      hasFocus: true,
    };
  },

  blur(state) {
    return {
      ...state,
      hasFocus: false,
      open: false,
    };
  },
};

module.exports = SelectState;
