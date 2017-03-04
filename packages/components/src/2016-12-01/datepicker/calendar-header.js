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
const formatMoment = require('../../utils/format-moment');

class CalendarHeader extends Element {
  constructor() {
    super();

    applyProps(this, {
      display: 'flex',
      'padding-bottom': 2,
    });
  }

  connectedCallback() {
    this._ensurePrev();
    this._ensureMonth();
    this._ensureNext();

    this.prevDiv.addEventListener('mousedown', this._emitPreviousMonth);
    this.nextDiv.addEventListener('mousedown', this._emitNextMonth);

    this._queueRender();
  }

  disconnectedCallback() {
    this.prevDiv.removeEventListener('mousedown', this._emitPreviousMonth);
    this.nextDiv.removeEventListener('mousedown', this._emitNextMonth);
  }

  set monthFormat(val) {
    this.state.monthFormat = val;
    this._queueRender();
  }

  set focusDate(val) {
    this.state.focusDate = val;
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

  _ensurePrev() {
    if (this.prevDiv !== undefined) { return; }
    this.prevDiv = document.createElement('orion-element');
    applyProps(this.prevDiv, {
      innerHTML: '&larr;',
      color: 'black',
      pointer: true,
    });
    this.appendChild(this.prevDiv);
  }

  _ensureMonth() {
    if (this.monthDiv !== undefined) { return; }
    this.monthDiv = document.createElement('div');
    this.appendChild(this.monthDiv);
  }

  _ensureNext() {
    if (this.nextDiv !== undefined) { return; }
    this.nextDiv = document.createElement('orion-element');
    applyProps(this.nextDiv, {
      innerHTML: '&rarr;',
      color: 'black',
      pointer: true,
    });
    this.appendChild(this.nextDiv);
  }

  _emitPreviousMonth(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('previousMonth', { bubbles: true }));
  }

  _emitNextMonth(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('nextMonth', { bubbles: true }));
  }

  render() {
    this._ensurePrev();
    this._ensureMonth();
    this._ensureNext();

    this.prevDiv.setAttribute('title', this.state.i18n ? this.state.i18n.previousMonth : '');
    this.nextDiv.setAttribute('title', this.state.i18n ? this.state.i18n.nextMonth : '');

    applyProps(this.monthDiv, {
      textContent: formatMoment(this.state.focusDate, this.state.monthFormat, this.state.locale),
    });

    super.render();
  }
}

Registry.define('orion-calendar-header', CalendarHeader);

module.exports = CalendarHeader;
