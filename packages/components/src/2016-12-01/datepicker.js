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
require('../../vendor/es5-custom-element-shim');

require('./datepicker/datepicker-calendar');

const Element = require('./element');
const DatepickerState = require('./datepicker/datepicker-state');
const Registry = require('../utils/private-registry');
const applyProps = require('../utils/apply-props');
const eventKey = require('../utils/event-key');
const formatMoment = require('../utils/format-moment');
const injectStyleTag = require('../utils/inject-style-tag');

function ensureEdgeHacks() {
  injectStyleTag('datepicker-edge-hacks', '[data-orion-id=datepicker-input]::-ms-clear { display: none; }');
}

class Datepicker extends Element {
  constructor() {
    super();
    this.state = DatepickerState.getInitialState();

    applyProps(this, {
      color: 'black',
      background: 'white',
      display: 'inline-block',
      position: 'relative',
    });

    ['_handleKeydown', '_focus', '_blur'].forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
  }

  connectedCallback() {
    ensureEdgeHacks();
    this._ensureInput();
    this._ensureCalendar();
    this._addListeners();
    this._queueRender();
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  set focus(val) {
    this._ensureCalendar();
    this.state.focus = val;

    if (val) {
      if (!this.state.focusDate) {
        this.state.focusDate = this.state.date || this.state.currentDate;
      }
      this.calendar.focusDate = this.state.focusDate;
    }

    this._queueRender();
  }

  get focusDate() {
    return this.state.focusDate;
  }

  set focusDate(val) {
    this.state.focusDate = val;
    this._queueRender();
  }

  set date(val) {
    this.state.date = val;
    this._queueRender();
  }

  set placeholder(val) {
    this.state.placeholder = val;
    this._queueRender();
  }

  get currentDate() {
    return this.state.currentDate;
  }

  set currentDate(val) {
    this.state.currentDate = val;
    this._queueRender();
  }

  set monthFormat(val) {
    this.state.monthFormat = val;
    this._queueRender();
  }

  get monthFormat() {
    return this.state.monthFormat;
  }

  set locale(val) {
    this.state.locale = val;
    this._queueRender();
  }

  get formattedDate() {
    return formatMoment(this.state.date, this.state.displayFormat, this.state.locale);
  }

  set displayFormat(val) {
    this.state.displayFormat = val;
    this._queueRender();
  }

  get isEnabled() {
    return this.state.isEnabled;
  }

  set isEnabled(fn) {
    this.state.isEnabled = fn;
    this._queueRender();
  }

  set i18n(val) {
    this.state.i18n = val;
    this._queueRender();
  }

  _handleRegularKeydown(event) {
    switch (eventKey(event)) {
      case 'ArrowUp':
        event.preventDefault();
        this._dispatchStateChange('focusPreviousWeek');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this._dispatchStateChange('focusNextWeek');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this._dispatchStateChange('focusPreviousDay');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this._dispatchStateChange('focusNextDay');
        break;
      case 'Enter':
        this._dispatchStateChange('selectFocusDate');
        this._dispatchStateChange('leaveFocused');
        break;
      case 'Escape':
      case 'Tab':
        this._dispatchStateChange('leaveFocused');
        break;
      case 'Backspace':
        event.preventDefault();
        this._dispatchStateChange('dateCleared');
        break;
      default:
        event.preventDefault();
    }
  }

  _handleShiftKeydown(event) {
    switch (eventKey(event)) {
      case 'ArrowLeft':
        event.preventDefault();
        this._dispatchStateChange('focusPreviousMonth');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this._dispatchStateChange('focusNextMonth');
        break;
      default:
    }
  }

  _handleKeydown(event) {
    if (event.shiftKey) {
      this._handleShiftKeydown(event);
    }

    this._handleRegularKeydown(event);
  }

  _focus() {
    this._dispatchStateChange('enterFocused');
  }

  _blur() {
    // Delay hiding of calendar to allow click events on days
    setTimeout(() => { this._dispatchStateChange('leaveFocused'); }, 150);
  }

  _handleDateSelected(event) {
    this._dispatchStateChange('selectDate', event.detail.selectedDate);
  }

  _handleHoverDate(event) {
    this._dispatchStateChange('setFocusDate', event.detail.hoveredDate);
  }

  _handlePreviousMonth() {
    this._dispatchStateChange('focusPreviousMonth');
  }

  _handleNextMonth() {
    this._dispatchStateChange('focusNextMonth');
  }

  _dispatchStateChange(eventType, arg) {
    const nextState = DatepickerState[eventType](this.state, arg);
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: eventType,
        state: nextState,
      },
    }));
  }

  _addListeners() {
    this.dateInput.addEventListener('keydown', this._handleKeydown);
    this.dateInput.addEventListener('focus', this._focus);
    this.dateInput.addEventListener('blur', this._blur);
    this.addEventListener('selectDate', this._handleDateSelected);
    this.addEventListener('hoverDate', this._handleHoverDate);
    this.addEventListener('nextMonth', this._handleNextMonth);
    this.addEventListener('previousMonth', this._handlePreviousMonth);
  }

  _removeListeners() {
    this.dateInput.removeEventListener('keydown', this._handleKeydown);
    this.dateInput.removeEventListener('focus', this._focus);
    this.dateInput.removeEventListener('blur', this._blur);
    this.removeEventListener('selectDate', this._handleDateSelected);
    this.removeEventListener('hoverDate', this._handleHoverDate);
    this.removeEventListener('nextMonth', this._handleNextMonth);
    this.removeEventListener('previousMonth', this._handlePreviousMonth);
  }

  _ensureInput() {
    this.dateInput = this.querySelector('input');

    if (this.dateInput === null) {
      this.dateInput = document.createElement('input');
      this.dateInput.setAttribute('data-orion-id', 'datepicker-input');
      this.appendChild(this.dateInput);
      applyProps(this.dateInput, {
        type: 'text',
      });
    }
  }

  _ensureCalendar() {
    this.calendar = this.querySelector('orion-datepicker-calendar');

    if (this.calendar === null) {
      this.calendar = document.createElement('orion-datepicker-calendar');
      this.appendChild(this.calendar);
    }
  }

  // Event Listeners

  render() {
    this._ensureInput();
    this._ensureCalendar();

    applyProps(this.dateInput, { value: this.formattedDate, placeholder: this.state.placeholder });

    applyProps(this.calendar, {
      display: this.state.focus ? 'block' : 'none',
      focusDate: this.focusDate,
      monthFormat: this.monthFormat,
      currentDate: this.currentDate,
      i18n: this.state.i18n,
      isEnabled: this.isEnabled,
      locale: this.state.locale,
    });

    super.render();
  }
}

Registry.define('orion-datepicker', Datepicker);

module.exports = Datepicker;
