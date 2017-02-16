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
    let focusedIndex = state.selectedIndex;
    if (focusedIndex === undefined) { focusedIndex = 0; }
    return {
      ...state,
      focusedIndex,
      open: true,
    };
  },

  optionFocused(state, focusedIndex) {
    return {
      ...state,
      focusedIndex,
    };
  },

  optionSelected(state, selectedIndex) {
    let nextSelectedIndex = selectedIndex;
    if (nextSelectedIndex === undefined) { nextSelectedIndex = state.selectedIndex; }
    return {
      ...state,
      selectedIndex: nextSelectedIndex,
      open: false,
    };
  },

  deactivated(state) {
    return {
      ...state,
      open: false,
      focusedIndex: undefined,
    };
  },

  focusPrevious(state) {
    if (!state.open) { return this.activated(state); }

    const prevIndex = this._nextFocusableIndex(
      state.focusedIndex,
      state.options,
      (index, options) => {
        index -= 1;
        if (index < 0) { index = options.length - 1; }
        return index;
      },
    );

    return { ...state, focusedIndex: prevIndex };
  },

  _nextFocusableIndex(focusedIndex, options, findNextIndex) {
    if (focusedIndex === undefined) {
      return this._firstFocusableIndex(options);
    }

    const focusableOptions = options.filter(option => !option.disabled);
    let focusableIndex = this._correspondingIndex(focusedIndex, options, focusableOptions);

    if (focusableIndex < 0) {
      return this._firstFocusableIndex(options);
    }

    focusableIndex = findNextIndex(focusableIndex, focusableOptions);

    const nextIndex = this._correspondingIndex(
      focusableIndex,
      focusableOptions,
      options,
    );

    return nextIndex;
  },

  _correspondingIndex(firstIndex, firstArray, correspondingArray) {
    const item = firstArray[firstIndex];
    return correspondingArray.indexOf(item);
  },

  _firstFocusableIndex(options) {
    const firstfocusableOption = options.find(option => !option.disabled);
    return options.indexOf(firstfocusableOption);
  },

  focusNext(state) {
    if (!state.open) { return this.activated(state); }

    let focusedIndex = state.focusedIndex;
    if (focusedIndex === undefined) {
      focusedIndex = 0;
    } else {
      focusedIndex = state.focusedIndex + 1;
      if (focusedIndex > state.options.length - 1) {
        focusedIndex = 0;
      }
    }

    return {
      ...state,
      focusedIndex,
    };
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
