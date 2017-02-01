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
function prevState(state) {
  return {
    disabled: state.disabled,
    hasFocus: state.hasFocus,
    hover: state.hover,
  };
}

const ButtonState = {
  getInitialState(state = {}) {
    return {
      disabled: false,
      hasFocus: false,
      hover: false,
      ...state,
    };
  },

  enterHover(state) {
    return { ...prevState(state), hover: true };
  },
  leaveHover(state) {
    return { ...prevState(state), hover: false };
  },

  enterDisabled(state) {
    return { ...prevState(state), disabled: true };
  },
  leaveDisabled(state) {
    return { ...prevState(state), disabled: false };
  },

  focus(state) {
    return { ...prevState(state), hasFocus: true };
  },
  blur(state) {
    return { ...prevState(state), hasFocus: false };
  },
};

module.exports = ButtonState;
