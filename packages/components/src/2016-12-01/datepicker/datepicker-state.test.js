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

import moment from 'moment';

const chai = require('chai');

const expect = chai.expect;

const DatepickerState = require('./datepicker-state');

describe('DatepickerState', () => {
  describe('getInitialState', () => {
    it('returns a default state', () => {
      const initialState = DatepickerState.getInitialState();
      expect(initialState.disabled).to.be.false;
      expect(initialState.focus).to.be.false;
      expect(initialState.date).to.be.null;
      expect(initialState.clearable).to.be.false;
      expect(initialState.focusDate).to.be.null;
      expect(initialState.displayFormat).to.equal('MM-DD-YYYY');
      expect(initialState.monthFormat).to.equal('MMMM YYYY');
      expect(initialState.i18n.previousMonth).to.equal('Previous Month');
      expect(initialState.i18n.nextMonth).to.equal('Next Month');
      expect(initialState.i18n.clearDate).to.equal('Clear Date');

      expect(initialState.currentDate.year()).to.equal(moment().year());
      expect(initialState.currentDate.month()).to.equal(moment().month());
      expect(initialState.currentDate.date()).to.equal(moment().date());
    });

    context('with a state', () => {
      it('extends default state with passed state', () => {
        const initialState = DatepickerState.getInitialState({ disabled: true, i18n: { previousMonth: 'Prev' } });
        expect(initialState.disabled).to.be.true;
        expect(initialState.i18n.previousMonth).to.equal('Prev');
        expect(initialState.focus).to.be.false;
      });
    });

    describe('isEnabled(<date>)', () => {
      let initialState;

      beforeEach(() => {
        initialState = DatepickerState.getInitialState();
      });

      it('is true for days after today', () => {
        const tomorrow = moment().add(1, 'days');
        expect(initialState.isEnabled(tomorrow)).to.be.true;
      });

      it('is true for today', () => {
        const today = moment();
        expect(initialState.isEnabled(today)).to.be.true;
      });

      it('is false for days before today', () => {
        const yesterday = moment().subtract(1, 'days');
        expect(initialState.isEnabled(yesterday)).to.be.false;
      });
    });
  });

  describe('enterDisabled', () => {
    it('sets disabled to true', () => {
      const nextState = DatepickerState.enterDisabled({ disabled: false });
      expect(nextState.disabled).to.be.true;
    });
  });

  describe('leaveDisabled', () => {
    it('sets disabled to false', () => {
      const nextState = DatepickerState.leaveDisabled({ disabled: true });
      expect(nextState.disabled).to.be.false;
    });
  });

  describe('enterFocused', () => {
    it('sets focus to true', () => {
      const nextState = DatepickerState.enterFocused({ focus: false });
      expect(nextState.focus).to.be.true;
    });

    context('with no date selected', () => {
      let today;
      let todayStr;
      let nextState;

      beforeEach(() => {
        today = moment();
        todayStr = today.toISOString();
        nextState = DatepickerState.enterFocused({ currentDate: today, focusDate: null });
      });

      it('sets the focusDate to today', () => {
        expect(nextState.focusDate.isSame(todayStr, 'day')).to.be.true;
      });
    });

    context('with date selected', () => {
      let selectedDate;
      let nextState;

      beforeEach(() => {
        selectedDate = moment().set({ year: 2020 });
        nextState = DatepickerState.enterFocused({ date: selectedDate, focusDate: null });
      });

      it('sets the focusDate to the selected date', () => {
        expect(nextState.focusDate.isSame(selectedDate, 'day')).to.be.true;
      });
    });
  });

  describe('leaveFocused', () => {
    it('sets focus to false', () => {
      const nextState = DatepickerState.leaveFocused({ focus: true });
      expect(nextState.focus).to.be.false;
    });

    it('sets the date to null', () => {
      const today = moment();
      const nextState = DatepickerState.leaveFocused({ focusDate: today });
      expect(nextState.focusDate).to.be.null;
    });
  });

  describe('selectDate', () => {
    let nextState;
    const selectedDate = moment('2017-02-02');

    context('isEnabled is undefined', () => {
      beforeEach(() => {
        nextState = DatepickerState.selectDate({}, selectedDate);
      });

      it('sets the selected date', () => {
        expect(nextState.date.isSame(selectedDate, 'date')).to.be.true;
      });

      it('set the focusDate', () => {
        expect(nextState.focusDate.isSame(selectedDate, 'date')).to.be.true;
      });
    });

    context('for a disabled date', () => {
      let nextEnabledDate;

      beforeEach(() => {
        nextEnabledDate = moment(selectedDate).add(1, 'day');
        const isEnabled = (date) => { return date !== selectedDate; };
        nextState = DatepickerState.selectDate({ isEnabled }, selectedDate);
      });

      it('sets the selected date to the next enabled date', () => {
        expect(nextState.date.isSame(nextEnabledDate, 'date')).to.be.true;
      });

      it('sets the focusDate to the next enabled date', () => {
        expect(nextState.focusDate.isSame(nextEnabledDate, 'date')).to.be.true;
      });

      context('with no enabled future dates in the next 31 days', () => {
        beforeEach(() => {
          const isEnabled = (date) => {
            const thirtyOneDaysAway = moment(selectedDate).add(31, 'days');
            return moment(date).isAfter(thirtyOneDaysAway);
          };
          nextState = DatepickerState.selectDate({ isEnabled }, selectedDate);
        });

        it('does not set the selected date', () => {
          expect(nextState.date).to.be.undefined;
        });

        it('does not set the focusDate', () => {
          expect(nextState.focusDate).to.be.undefined;
        });
      });
    });

    context('for an enabled date', () => {
      beforeEach(() => {
        const isEnabled = () => { return true; };
        nextState = DatepickerState.selectDate({ isEnabled }, selectedDate);
      });

      it('sets the selected date', () => {
        expect(nextState.date.isSame(selectedDate, 'date')).to.be.true;
      });

      it('set the focusDate', () => {
        expect(nextState.focusDate.isSame(selectedDate, 'date')).to.be.true;
      });
    });
  });

  describe('setCurrentDate', () => {
    let state;
    let nextState;
    let setDate;

    beforeEach(() => {
      setDate = moment().set({
        year: 2015,
        month: 0,
        date: 10,
      });
      state = { currentDate: moment() };
      nextState = DatepickerState.setCurrentDate(state, setDate);
    });

    it('sets the date to the given date', () => {
      expect(nextState.currentDate.year()).to.equal(2015);
      expect(nextState.currentDate.month()).to.equal(0);
      expect(nextState.currentDate.date()).to.equal(10);
    });
  });

  describe('focusNextDay', () => {
    const focusDate = moment().add(1, 'month');
    let nextState;

    beforeEach(() => {
      nextState = DatepickerState.focusNextDay({ focusDate });
    });

    it('sets focusDate to the next day', () => {
      expect(nextState.focusDate.isSame(focusDate.add(1, 'day'), 'date')).to.be.true;
    });
  });

  describe('focusPreviousDay', () => {
    const focusDate = moment().add(1, 'month');
    let nextState;

    beforeEach(() => {
      nextState = DatepickerState.focusPreviousDay({ focusDate });
    });

    it('sets focusDate to the previous day', () => {
      expect(nextState.focusDate.isSame(focusDate.subtract(1, 'day'), 'date')).to.be.true;
    });
  });

  describe('focusNextWeek', () => {
    const focusDate = moment().add(1, 'month');
    let nextState;

    beforeEach(() => {
      nextState = DatepickerState.focusNextWeek({ focusDate });
    });

    it('sets focusDate to the next week', () => {
      expect(nextState.focusDate.isSame(focusDate.add(1, 'week'), 'date')).to.be.true;
    });
  });

  describe('focusPreviousWeek', () => {
    const focusDate = moment().add(1, 'month');
    let nextState;

    beforeEach(() => {
      nextState = DatepickerState.focusPreviousWeek({ focusDate });
    });

    it('sets focusDate to the previous week', () => {
      expect(nextState.focusDate.isSame(focusDate.subtract(1, 'week'), 'date')).to.be.true;
    });
  });

  describe('focusNextMonth', () => {
    const focusDate = moment().add(2, 'month');
    let nextState;

    beforeEach(() => {
      nextState = DatepickerState.focusNextMonth({ focusDate });
    });

    it('sets focusDate to the next month', () => {
      expect(nextState.focusDate.isSame(focusDate.add(1, 'month'), 'date')).to.be.true;
    });
  });

  describe('focusPreviousMonth', () => {
    const focusDate = moment().add(2, 'month');
    let nextState;

    beforeEach(() => {
      nextState = DatepickerState.focusPreviousMonth({ focusDate });
    });

    it('sets focusDate to the next month', () => {
      expect(nextState.focusDate.isSame(focusDate.subtract(1, 'month'), 'date')).to.be.true;
    });
  });

  describe('setFocusDate', () => {
    let nextState;
    const focusDate = moment('2017-02-02');

    context('when isEnabled is undefined', () => {
      beforeEach(() => {
        nextState = DatepickerState.setFocusDate({}, focusDate);
      });

      it('sets the focusDate', () => {
        expect(nextState.focusDate.isSame(focusDate, 'date')).to.be.true;
      });
    });

    context('with an enabled date', () => {
      beforeEach(() => {
        const isEnabled = () => { return true; };
        nextState = DatepickerState.setFocusDate({ isEnabled }, focusDate);
      });

      it('set the focusDate', () => {
        expect(nextState.focusDate.isSame(focusDate, 'date')).to.be.true;
      });
    });

    context('with a disabled date', () => {
      beforeEach(() => {
        const state = { isEnabled: (date) => { return date !== focusDate; } };
        nextState = DatepickerState.setFocusDate(state, focusDate);
      });

      it('sets the next enabled date', () => {
        const nextDay = moment(focusDate).add(1, 'day');
        expect(nextState.focusDate.isSame(nextDay, 'date')).to.be.true;
      });

      context('with no enabled future dates in the next 31 days', () => {
        beforeEach(() => {
          const isEnabled = (date) => {
            const thirtyOneDaysAway = moment(focusDate).add(31, 'days');
            return moment(date).isAfter(thirtyOneDaysAway);
          };
          nextState = DatepickerState.setFocusDate({ isEnabled }, focusDate);
        });

        it('does not set the focusDate', () => {
          expect(nextState.focusDate).to.be.undefined;
        });
      });
    });
  });

  describe('selectFocusDate', () => {
    const focusDate = moment().add(1, 'month');
    let nextState;

    beforeEach(() => {
      nextState = DatepickerState.selectFocusDate({ focusDate });
    });

    it('sets the date to the focusDate', () => {
      expect(nextState.date.isSame(focusDate, 'date')).to.be.true;
    });
  });
});
