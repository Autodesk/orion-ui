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

  _ensurePrev() {
    if (this.prevDiv !== undefined) { return; }
    this.prevDiv = document.createElement('a');
    this.prevDiv.innerHTML = '&larr;';
    this.appendChild(this.prevDiv);
  }

  _ensureMonth() {
    if (this.monthDiv !== undefined) { return; }
    this.monthDiv = document.createElement('div');
    this.appendChild(this.monthDiv);
  }

  _ensureNext() {
    if (this.nextDiv !== undefined) { return; }
    this.nextDiv = document.createElement('a');
    this.nextDiv.innerHTML = '&rarr;';
    this.appendChild(this.nextDiv);
  }

  render() {
    this._ensurePrev();
    this._ensureMonth();
    this._ensureNext();

    if (this.state.focusDate && this.state.monthFormat) {
      applyProps(this.monthDiv, {
        textContent: this.state.focusDate.format(this.state.monthFormat),
      });
    }

    super.render();
  }
}

Registry.define('orion-calendar-header', CalendarHeader);

module.exports = CalendarHeader;
