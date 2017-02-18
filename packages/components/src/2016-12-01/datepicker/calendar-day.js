/* global moment:false */
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

require('../../../vendor/es5-custom-element-shim');

const Element = require('../element');
const Registry = require('../../utils/private-registry');
const applyProps = require('../../utils/apply-props');

class CalendarDay extends Element {
  constructor() {
    super();

    const baseStyle = {
      'border-right': 1,
      'border-color': 'grey2',
    };

    this.pastDayStyle = { ...baseStyle, color: 'grey4', notallowed: true };
    this.currentDayStyle = { ...baseStyle, color: 'black', pointer: true };
    this.futureDayStyle = { ...baseStyle, pointer: true };
  }

  set date(val) {
    this.state.date = val;
    this.setAttribute('data-date', this.state.date.format());
    this._queueRender();
  }

  set focusDate(val) {
    this.state.focusDate = val;
    this._queueRender();
  }

  set currentDate(val) {
    this.state.currentDate = val;
    this._queueRender();
  }

  isCurrentDay() {
    if (!this.state.date || !this.state.currentDate) { return false; }
    const today = this.state.currentDate;
    const day = this.state.date;
    return day.year() === today.year() &&
           day.month() === today.month() &&
           day.date() === today.date();
  }

  get kind() {
    if (this.isCurrentDay()) {
      return 'current';
    }

    if (this.state.date.isBefore(this.state.currentDate)) {
      return 'past';
    }

    return 'future';
  }

  isInMonth() {
    return this.state.date.month() === this.state.focusDate.month();
  }

  get dayNumber() {
    return this.isInMonth() ? this.state.date.date() : '';
  }

  _emitDateSelected() {
    if (this.kind !== 'past') {
      this.dispatchEvent(new CustomEvent('dateSelected', {
        detail: { selectedDate: this.state.date },
        bubbles: true,
      }));
    }
  }

  connectedCallback() {
    this.style.width = '14%';
    this.style.paddingLeft = '4px';
    this.style.lineHeight = '1.75em';

    this.addEventListener('click', this._emitDateSelected);

    this._queueRender();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._emitDateSelected);
  }

  render() {
    if (this.state.date && this.state.focusDate && this.state.currentDate) {
      this.textContent = this.dayNumber;

      switch (this.kind) {
        case 'current':
          applyProps(this, this.currentDayStyle);
          this.style.fontWeight = 'bold';
          break;
        case 'past':
          applyProps(this, this.pastDayStyle);
          break;
        case 'future':
          applyProps(this, this.futureDayStyle);
          break;
        default:
          break;
      }
    }

    super.render();
  }
}

Registry.define('orion-calendar-day', CalendarDay);

module.exports = CalendarDay;
