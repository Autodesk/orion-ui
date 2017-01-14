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
    }
  },

  focusNext(state) {
    return {
      ...state,
      open: true,
    }
  },
};

module.exports = SelectState;
