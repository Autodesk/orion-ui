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
require('../../vendor/es5-custom-element-shim.js');
require('./button');
require('./select-menu.js');
const Element = require('./element');
const SelectState = require('./select-state.js');

const Registry = require('../utils/private-registry.js');
const applyProps = require('../utils/apply-props');
const eventKey = require('../utils/event-key');

class Select extends Element {
  constructor() {
    super();

    this.BUTTON_HEIGHT = 35;

    this.state = SelectState.getInitialState();
    this.state.options = [];
    this.display = 'inline-block';

    ['_setFocusedOption', '_setSelectedOption', '_handleKeydown', '_toggle', '_focus', '_blur', '_deactivate'].forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
  }

  set options(newOptions) {
    this.state.options = newOptions;
    this._queueRender();
  }

  set open(newValue) {
    this.state.open = newValue;
    this._queueRender();
  }

  set focusedIndex(newValue) {
    this.state.focusedIndex = newValue;
    this._queueRender();
  }

  set selectedIndex(newValue) {
    this.state.selectedIndex = newValue;
    this._queueRender();
  }

  set hasFocus(val) {
    this.state.hasFocus = val;
    this._queueRender();
  }

  get hasFocus() {
    return this.state.hasFocus;
  }

  connectedCallback() {
    this._addListeners();
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  _ensureButton() {
    this.button = this.querySelector('orion-button');
    if (this.button === null) {
      this.button = document.createElement('orion-button');
      applyProps(this.button, {
        textContent: 'Select',
      });
      this.appendChild(this.button);
    }
  }

  _addListeners() {
    this._ensureButton();
    this._ensureMenu();

    this.addEventListener('keydown', this._handleKeydown);
    this.button.addEventListener('click', this._toggle);
    this.button.addEventListener('focus', this._focus);
    this.button.addEventListener('blur', this._blur);
    this.addEventListener('optionSelected', this._setSelectedOption);
    this.addEventListener('optionFocused', this._setFocusedOption);
    this.menu.addEventListener('closed', this._deactivate);
  }

  _removeListeners() {
    this.removeEventListener('keydown', this._handleKeydown);
    this.button.removeEventListener('click', this._toggle);
    this.button.removeEventListener('focus', this._focus);
    this.button.removeEventListener('blur', this._blur);
    this.removeEventListener('optionSelected', this._setSelectedOption);
    this.removeEventListener('optionFocused', this._setFocusedOption);
    this.menu.removeEventListener('closed', this._deactivate);
  }

  _toggle() {
    this._dispatchStateChange('toggleOpen');
  }

  _deactivate() {
    this._dispatchStateChange('deactivated');
  }

  _handleKeydown(event) {
    switch (eventKey(event)) {
      case 'Escape':
        this._dispatchStateChange('deactivated');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this._dispatchStateChange('focusPrevious');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this._dispatchStateChange('focusNext');
        break;
      case 'Tab':
      case 'Enter':
        this._dispatchStateChange('optionSelected', this.state.focusedIndex);
        break;
      default:
    }
  }

  _setSelectedOption(event) {
    event.preventDefault();
    const nextState = SelectState.optionSelected(this.state, event.detail.selectedIndex);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { type: 'optionSelected', state: nextState },
    }));
  }

  _setFocusedOption(event) {
    const nextState = SelectState.optionFocused(this.state, event.detail.focusedIndex);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { type: 'optionFocused', state: nextState },
    }));
  }

  _focus() {
    this._dispatchStateChange('focus');
  }

  _blur() {
    this._dispatchStateChange('blur');
  }

  _ensureMenu() {
    this.menu = this.querySelector('orion-select-menu');
    if (this.menu === null) {
      this.menu = document.createElement('orion-select-menu');
      this.appendChild(this.menu);
    }
  }

  _dispatchStateChange(eventType, arg) {
    const nextState = SelectState[eventType](this.state, arg);
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: eventType,
        state: nextState,
      },
    }));
  }

  _render() {
    this._ensureButton();
    this._ensureMenu();

    applyProps(this.menu, {
      open: this.state.open,
      options: this.state.options,
      top: `${this.offsetTop + this.BUTTON_HEIGHT}px`,
      left: `${this.offsetLeft}px`,
      focusedIndex: this.state.focusedIndex,
      selectedIndex: this.state.selectedIndex,
    });

    let label = 'Select';
    const selectedOption = this.state.options[this.state.selectedIndex];
    if (selectedOption !== undefined) {
      label = selectedOption.label;
    }
    applyProps(this.button, {
      textContent: label,
      hasFocus: (this.state.hasFocus && !this.state.open),
    });

    super._render();
  }
}

Registry.define('orion-select', Select);

module.exports = Select;
