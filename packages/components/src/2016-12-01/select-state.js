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

  activated(state) {
    return {
      ...state,
      open: true,
    };
  },

  optionChosen(state, chosenIndex) {
    let chosenValue;
    const chosenOption = state.options[chosenIndex];
    if (typeof chosenOption !== 'undefined') {
      chosenValue = chosenOption.value;
    }

    return {
      ...state,
      value: chosenValue,
      open: false,
    };
  },

  deactivated(state) {
    return {
      ...state,
      open: false,
    };
  },

  focusPrevious(state) {
    return {
      ...state,
      open: true,
    };
  },

  focusNext(state) {
    return {
      ...state,
      open: true,
    };
  },
};

module.exports = SelectState;
