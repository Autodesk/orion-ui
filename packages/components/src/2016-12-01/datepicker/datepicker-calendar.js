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

import moment from 'moment';

require('../../../vendor/es5-custom-element-shim');
require('./calendar-header');
require('./calendar-day');

const Element = require('../element');
const Registry = require('../../utils/private-registry');
const applyProps = require('../../utils/apply-props');

class DatepickerCalendar extends Element {
  constructor() {
    super();

    applyProps(this, {
      display: 'none',
      position: 'absolute',
      top: 4,
      'padding-vertical': 3,
      'padding-horizontal': 3,
      border: 1,
      background: 'white',
      'border-color': 'black',
      'box-shadow': 1,
    });
  }

  ensureElements() {
    this._ensureElements([
      ['header', 'orion-calendar-header'],
    ]);

    this._ensureWeeksHeader();

    this._ensureElements([
      ['weeks', 'orion-element'],
    ]);

    this._ensureWeeks();
  }

  connectedCallback() {
    this.style.width = '220px';
    this.ensureElements();
    this._queueRender();
  }

  set monthFormat(val) {
    this.state.monthFormat = val;
    this._queueRender();
  }

  _monthChanged(newDate) {
    const oldDate = this.state.focusDate;

    if (!oldDate || !newDate) { return true; }

    return oldDate.month() !== newDate.month() ||
           oldDate.year() !== newDate.year();
  }

  set focusDate(val) {
    this.state.focusDate = val;
    this._queueRender();
  }

  set currentDate(val) {
    this.state.currentDate = val;
    this._queueRender();
  }

  _ensureWeeksHeader() {
    let weeksHeader = this.querySelector('[data-orion-id=weeks-header]');
    if (weeksHeader !== null) { return; }

    weeksHeader = document.createElement('orion-element');
    weeksHeader.setAttribute('data-orion-id', 'weeks-header');

    applyProps(weeksHeader, {
      display: 'flex',
      border: 1,
      'border-color': 'grey2',
    });

    let lastCreatedHeaderCell = null;

    [...Array(7)].forEach((_, i) => {
      const dayOfWeek = moment().weekday(i).format('dd');
      const div = document.createElement('orion-element');

      applyProps(div, {
        textContent: dayOfWeek,
        'border-right': 1,
        'border-color': 'grey2',
        background: 'grey1',
      });
      div.style.width = '14%';
      div.style.paddingLeft = '4px';
      div.style.lineHeight = '1.75em';

      lastCreatedHeaderCell = div;

      weeksHeader.appendChild(div);
      this.appendChild(weeksHeader);
    });

    applyProps(lastCreatedHeaderCell, {
      'border-right': 0,
    });

    this.appendChild(weeksHeader);
  }

  _ensureWeeks() {
    if (this.weeks.childNodes.length > 0) { return; }

    applyProps(this.weeks, {
      'border-left': 1,
      'border-color': 'grey3',
      display: 'block',
    });

    this.state.rows = [...Array(7)].map((_, weekIdx) => {
      const even = (weekIdx % 2 === 0);
      return this._ensureWeek(even);
    });
  }

  _ensureWeek(even) {
    const week = document.createElement('orion-element');

    applyProps(week, {
      'border-bottom': 1,
      'border-color': 'grey2',
      background: even ? 'grey0' : 'white',
    });

    [...Array(7)].forEach(() => {
      const dayEl = document.createElement('orion-calendar-day');
      week.appendChild(dayEl);
    });

    this.weeks.appendChild(week);

    return week;
  }

  _renderWeeks() {
    if (!this.state.focusDate || !this.state.currentDate) { return; }

    const focusDate = this.state.focusDate;
    const currentDate = this.state.currentDate;
    const year = focusDate.year();
    const month = focusDate.month();
    const startDate = moment([year, month]);
    const startDayOfCalendar = moment(startDate).startOf('week');

    let firstDayOfWeek = moment(startDayOfCalendar);

    [...Array(7)].forEach((_, dayIdx) => {
      const shouldRender = firstDayOfWeek.isSame(focusDate, 'month') || dayIdx === 0;
      this._renderWeek(dayIdx, currentDate, focusDate, firstDayOfWeek, shouldRender);
      firstDayOfWeek = firstDayOfWeek.add(1, 'week');
    });
  }

  _renderWeek(index, currentDate, focusDate, startDate, shouldRender) {
    const week = this.weeks.childNodes[index];
    if (shouldRender) {
      week.display = 'flex';
    } else {
      week.display = 'none';
      return;
    }

    [...Array(7)].forEach((_, i) => {
      const date = moment(startDate).add(i, 'days');
      const dayEl = week.childNodes[i];
      applyProps(dayEl, {
        date,
        focusDate,
        currentDate,
      });
    });
  }

  render() {
    this.ensureElements();

    applyProps(this.header, {
      monthFormat: this.state.monthFormat,
      focusDate: this.state.focusDate,
    });

    this._renderWeeks();

    super.render();
  }
}

Registry.define('orion-datepicker-calendar', DatepickerCalendar);

module.exports = DatepickerCalendar;
