/* eslint-disable no-unused-vars */
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

/* global moment:false */

import moment from 'moment';

const DatepickerState = {
  getInitialState(state = {}) {
    return {
      disabled: false,
      focus: false,
      date: null,
      clearable: false,
      focusDate: null,
      currentDate: moment(),
      displayFormat: 'MM-DD-YYYY',
      monthFormat: 'MMMM YYYY',
      i18n: {
        previousMonth: 'Previous Month',
        nextMonth: 'Next Month',
        clearDate: 'Clear Date',
      },
      isEnabled: (date) => {
        return date.isAfter(this.currentDate);
      },
      ...state,
    };
  },

  enterDisabled(state) {
    return { ...state, disabled: true };
  },

  leaveDisabled(state) {
    return { ...state, disabled: false };
  },

  enterFocused(state) {
    return { ...state, focus: true, focusDate: state.currentDate };
  },

  leaveFocused(state) {
    return { ...state, focus: false, focusDate: null };
  },

  dateSelected(state, date) {
    return { ...state, date };
  },

  dateCleared(state) {
    return { ...state,  date: '' }
  },

  setCurrentDate(state, currentDate) {
    return { ...state, currentDate };
  },
};

module.exports = DatepickerState;
