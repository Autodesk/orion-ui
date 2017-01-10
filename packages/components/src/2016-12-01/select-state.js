const SelectState = {
  getInitialState(state) {
    return {
      open: false,
      ...state,
    };
  },

  enterOpen(state) {
    return {
      ...state,
      open: true,
    };
  },

  leaveOpen(state) {
    return {
      ...state,
      open: false,
    };
  },
};

module.exports = SelectState;
