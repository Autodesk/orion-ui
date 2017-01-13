const PopoverState = {
  getInitialState(state) {
    return {
      open: false,
      ...state,
    };
  },

  clickedOutside(state) {
    return {
      ...state,
      open: false,
    }
  }
};

module.exports = PopoverState;
