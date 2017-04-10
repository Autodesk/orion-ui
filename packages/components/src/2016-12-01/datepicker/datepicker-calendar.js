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

require('./calendar-header');
require('./calendar-day');

const Element = require('../element');
const Registry = require('../../utils/private-registry');
const applyProps = require('../../utils/apply-props');
const formatMoment = require('../../utils/format-moment');

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
      'box-shadow': 1
    });
  }

  ensureElements() {
    this._ensureElements([['header', 'orion-calendar-header']]);

    this._ensureWeeksHeader();

    this._ensureElements([['weeks', 'orion-element']]);

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

  set focusDate(val) {
    this.state.focusDate = val;
    this._queueRender();
  }

  set currentDate(val) {
    this.state.currentDate = val;
    this._queueRender();
  }

  set locale(val) {
    this.state.locale = val;
    this._queueRender();
  }

  set i18n(val) {
    this.state.i18n = val;
    this._queueRender();
  }

  get isEnabled() {
    return this.state.isEnabled;
  }

  set isEnabled(fn) {
    this.state.isEnabled = fn;
    this._queueRender();
  }

  _ensureWeeksHeader() {
    this.weeksHeader = this.querySelector('[data-orion-id=weeks-header]');
    if (this.weeksHeader !== null) {
      return;
    }

    this.weeksHeader = document.createElement('orion-element');
    this.weeksHeader.setAttribute('data-orion-id', 'weeks-header');

    applyProps(this.weeksHeader, {
      display: 'flex',
      border: 1,
      'border-color': 'grey2'
    });

    let lastCreatedHeaderCell = null;

    [...Array(7)].forEach(() => {
      const div = document.createElement('orion-element');

      applyProps(div, {
        'border-right': 1,
        'border-color': 'grey2',
        background: 'grey1'
      });
      div.style.width = '14%';
      div.style.paddingLeft = '4px';
      div.style.lineHeight = '1.75em';

      lastCreatedHeaderCell = div;

      this.weeksHeader.appendChild(div);
      this.appendChild(this.weeksHeader);
    });

    applyProps(lastCreatedHeaderCell, {
      'border-right': 0
    });

    this.appendChild(this.weeksHeader);
  }

  _ensureWeeks() {
    if (this.weeks.childNodes.length > 0) {
      return;
    }

    applyProps(this.weeks, {
      'border-left': 1,
      'border-color': 'grey3',
      display: 'block'
    });

    this.state.rows = [...Array(7)].map((_, weekIdx) => {
      const even = weekIdx % 2 === 0;
      return this._ensureWeek(even);
    });
  }

  _ensureWeek(even) {
    const week = document.createElement('orion-element');

    applyProps(week, {
      'border-bottom': 1,
      'border-color': 'grey2',
      background: even ? 'grey0' : 'white'
    });

    [...Array(7)].forEach(() => {
      const dayEl = document.createElement('orion-calendar-day');
      week.appendChild(dayEl);
    });

    this.weeks.appendChild(week);

    return week;
  }

  _renderWeeks() {
    if (!this.state.focusDate || !this.state.currentDate) {
      return;
    }

    const focusDate = this.state.focusDate;
    const currentDate = this.state.currentDate;
    const year = focusDate.year();
    const month = focusDate.month();
    const startDate = moment([year, month]);
    const startDayOfCalendar = moment(startDate).startOf('week');

    let firstDayOfWeek = moment(startDayOfCalendar);

    [...Array(7)].forEach((_, dayIdx) => {
      const dayOfWeek = formatMoment(
        moment().weekday(dayIdx),
        'dd',
        this.state.locale
      );
      const headerDay = this.weeksHeader.childNodes[dayIdx];
      headerDay.textContent = dayOfWeek;
    });

    [...Array(7)].forEach((_, weekIdx) => {
      const shouldRender = firstDayOfWeek.isSame(focusDate, 'month') ||
        weekIdx === 0;
      this._renderWeek(
        weekIdx,
        currentDate,
        focusDate,
        firstDayOfWeek,
        shouldRender
      );
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
        isEnabled: this.isEnabled,
        date,
        focusDate,
        currentDate
      });
    });
  }

  render() {
    this.ensureElements();

    applyProps(this.header, {
      locale: this.state.locale,
      monthFormat: this.state.monthFormat,
      focusDate: this.state.focusDate,
      i18n: this.state.i18n
    });

    this._renderWeeks();

    super.render();
  }
}

Registry.define('orion-datepicker-calendar', DatepickerCalendar);

module.exports = DatepickerCalendar;
