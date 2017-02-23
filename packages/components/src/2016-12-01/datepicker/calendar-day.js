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
      background: 'white',
      pointer: true,
      notallowed: false,
    };

    this.pastDayStyle = { ...baseStyle, color: 'grey4', pointer: false, notallowed: true };
    this.currentDayStyle = { ...baseStyle, color: 'black' };
    this.futureDayStyle = { ...baseStyle, color: 'black' };
    this.focusedDayStyle = { background: 'blue', color: 'white' };
    this.otherMonthStyle = { pointer: false, notallowed: true };
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
    return this.state.date.isSame(this.state.currentDate, 'day');
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
    return this.state.date.isSame(this.state.focusDate, 'month');
  }

  isFocusedDay() {
    return this.state.date.isSame(this.state.focusDate, 'day');
  }

  get dayNumber() {
    return this.isInMonth() ? this.state.date.date() : '';
  }

  _emitDateSelected() {
    if (this.kind !== 'past') {
      this.dispatchEvent(new CustomEvent('selectDate', {
        detail: { selectedDate: this.state.date },
        bubbles: true,
      }));
    }
  }

  _emitHover() {
    if (this.kind !== 'past' && this.isInMonth()) {
      this.dispatchEvent(new CustomEvent('hoverDate', {
        detail: { hoveredDate: this.state.date },
        bubbles: true,
      }));
    }
  }

  connectedCallback() {
    this.style.width = '14%';
    this.style.paddingLeft = '4px';
    this.style.lineHeight = '1.75em';

    this.addEventListener('mousedown', this._emitDateSelected);
    this.addEventListener('mouseenter', this._emitHover);

    this._queueRender();
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this._emitDateSelected);
    this.removeEventListener('mouseenter', this._emitHover);
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
          this.style.fontWeight = 'normal';
          break;
        case 'future':
          applyProps(this, this.futureDayStyle);
          this.style.fontWeight = 'normal';
          break;
        default:
          break;
      }

      if (!this.isInMonth()) {
        applyProps(this, this.otherMonthStyle);
      }

      if (this.isFocusedDay()) {
        applyProps(this, this.focusedDayStyle);
      }
    }

    super.render();
  }
}

Registry.define('orion-calendar-day', CalendarDay);

module.exports = CalendarDay;
