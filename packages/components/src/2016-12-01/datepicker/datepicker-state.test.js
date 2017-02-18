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

      it('is false for today', () => {
        const today = moment();
        expect(initialState.isEnabled(today)).to.be.false;
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

    it('sets the focusDate to today', () => {
      const today = moment();
      const todayStr = today.toISOString();
      const nextState = DatepickerState.enterFocused({ currentDate: today, focusDate: null });
      expect(nextState.focusDate.toISOString()).to.equal(todayStr);
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
});
