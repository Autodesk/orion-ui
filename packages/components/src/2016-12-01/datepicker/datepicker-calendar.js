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
      ['weeks', 'orion-element'],
    ]);
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

    if (!oldDate) { return true; }

    return oldDate.month() !== newDate.month() ||
           oldDate.year() !== newDate.year();
  }

  set focusDate(val) {
    if (this._monthChanged(val)) {
      this._weeksRenderQueued = true;
    }
    this.state.focusDate = val;
    this._queueRender();
  }

  _renderWeeksHeader() {
    const weeksHeader = document.createElement('orion-element');

    applyProps(weeksHeader, {
      display: 'flex',
      'border-bottom': 1,
      'border-color': 'grey2',
    });

    let lastCreatedHeaderCell = null;

    [...Array(7)].forEach((_, i) => {
      const day = moment(this.state.focusDate);
      const dayOfWeek = day.weekday(i).format('dd');
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
    });

    applyProps(lastCreatedHeaderCell, {
      'border-right': 0,
    });

    this.weeks.appendChild(weeksHeader);
  }

  _renderWeeks() {
    if (!this.state.focusDate) { return; }

    this.style.opacity = '0';

    const focusDate = this.state.focusDate;

    this._renderWeeksHeader();

    const year = focusDate.year();
    const month = focusDate.month();
    const startDate = moment([year, month]);
    const startDayOfCalendar = moment(startDate).startOf('week');

    let firstDayOfWeek = moment(startDayOfCalendar);
    let lastCreatedWeek = null;
    let weekIdx = 0;

    // Always render first week
    this._renderWeek(focusDate, firstDayOfWeek);
    firstDayOfWeek = firstDayOfWeek.add(1, 'week');

    // Keep rendering until we end up outside the displayed month
    while (firstDayOfWeek.month() === month) {
      const even = (weekIdx % 2 === 0);
      lastCreatedWeek = this._renderWeek(focusDate, firstDayOfWeek, even);
      firstDayOfWeek = firstDayOfWeek.add(1, 'week');
      weekIdx += 1;
    }

    applyProps(lastCreatedWeek, {
      'border-bottom': 0,
    });

    requestAnimationFrame(() => {
      this.style.opacity = '1';
    });

    this._weeksRenderQueued = false;
  }

  _renderWeek(focusDate, startDate, even) {
    const week = document.createElement('orion-element');

    applyProps(week, {
      display: 'flex',
      'border-bottom': 1,
      'border-color': 'grey2',
      background: even ? 'grey0' : 'white',
    });

    let lastCreatedDay = null;

    [...Array(7)].forEach((_, i) => {
      const day = moment(startDate).add(i, 'days');
      const div = document.createElement('orion-element');
      lastCreatedDay = div;

      applyProps(div, {
        'border-right': 1,
        'border-color': 'grey2',
      });

      if (day.isBefore(focusDate)) {
        applyProps(div, { color: 'grey4' });
      } else {
        applyProps(div, { pointer: true });
      }

      // Current Day
      if (day.month() === focusDate.month() && day.date() === focusDate.date()) {
        applyProps(div, { color: 'black', pointer: true });
        div.style.fontWeight = 'bold';
      }

      div.style.width = '14%';
      div.style.paddingLeft = '4px';
      div.style.lineHeight = '1.75em';

      // Add day of the month to div if its part of this month
      if (day.month() === focusDate.month()) {
        div.textContent = day.date();
      }

      week.appendChild(div);
    });

    applyProps(lastCreatedDay, {
      'border-right': 0,
    });

    this.weeks.appendChild(week);

    return week;
  }

  _render() {
    this.ensureElements();

    applyProps(this.header, {
      monthFormat: this.state.monthFormat,
      focusDate: this.state.focusDate,
    });

    applyProps(this.weeks, {
      border: 1,
      'border-color': 'grey3',
      display: 'block',
    });

    if (this._weeksRenderQueued === true) {
      this.weeks.innerHTML = '';
      this._renderWeeks();
    }

    super._render();
  }
}

Registry.define('orion-datepicker-calendar', DatepickerCalendar);

module.exports = DatepickerCalendar;
