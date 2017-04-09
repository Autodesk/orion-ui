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
require('./button');
require('./select-menu.js');
const Element = require('./element');
const SelectState = require('./select-state.js');

const Registry = require('../utils/private-registry.js');
const applyProps = require('../utils/apply-props');
const eventKey = require('../utils/event-key');

function blockInputChangeEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

class Select extends Element {
  constructor() {
    super();

    this.BUTTON_HEIGHT = 35;
    this.Z_INDEX = 1000;

    this.state = SelectState.getInitialState();
    this.state.options = [];
    this.display = 'inline-block';
    this.position = 'relative';

    [
      '_setFilter', '_resetButtonListeners', '_listenForMouseUp', '_setFocusedOption',
      '_setSelectedOption', '_handleKeydown', '_toggle', '_focus', '_blur', '_deactivate',
      '_clearSelection',
    ].forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
  }

  set options(newOptions) {
    this.state.options = newOptions;
    this._queueRender();
  }

  set filteredOptions(newOptions) {
    this.state.filteredOptions = newOptions;
    this._queueRender();
  }

  set filter(val) {
    this.state.filter = val;
    this._queueRender();
  }

  set open(newValue) {
    this.state.open = newValue;
    this._queueRender();
  }

  set disabled(newValue) {
    this.state.disabled = newValue;
    this._queueRender();
  }

  set focusedKey(newValue) {
    this.state.focusedKey = newValue;
    this._queueRender();
  }

  set selectedIndex(index) {
    this.state.selectedIndex = index;
    const option = this.state.options[index];
    if (option) {
      this.selectedKey = option.key;
    } else {
      this.selectedKey = undefined;
    }
  }

  set selectedKey(newValue) {
    this.state.selectedKey = newValue;
    this._queueRender();
  }

  set searchable(newValue) {
    if (newValue === this.state.searchable) { return; }

    this.state.searchable = newValue;
    this._removeListeners();

    if (this.button !== undefined) {
      this.button.remove();
    }

    this._addListeners();
    this._queueRender();
  }

  set clearable(val) {
    this.state.clearable = val;
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
    this.button = this.querySelector('[data-orion-id=select-button]');
    if (this.button === null) {
      if (this.state.searchable) {
        this.button = document.createElement('input');

        applyProps(this.button, {
          placeholder: 'Select',
        });
      } else {
        this.button = document.createElement('orion-button');
        applyProps(this.button, {
          textContent: 'Select',
        });
      }

      this.button.setAttribute('data-orion-id', 'select-button');
      this.insertBefore(this.button, this.menu);
    }
  }

  _ensureClear() {
    this.clear = this.querySelector('[data-orion-id=select-clear]');
    if (this.clear) { return; }

    this.clear = document.createElement('orion-button');
    this.clear.setAttribute('data-orion-id', 'select-clear');
    applyProps(this.clear, {
      textContent: '✕',
      size: 'small',
    });
  }

  _addListeners() {
    this._ensureMenu();
    this._ensureButton();
    this._ensureClear();

    this.addEventListener('keydown', this._handleKeydown);
    this.addEventListener('optionSelected', this._setSelectedOption);
    this.addEventListener('optionFocused', this._setFocusedOption);

    this.button.addEventListener('mousedown', this._listenForMouseUp);
    this.button.addEventListener('focus', this._focus);
    this.button.addEventListener('blur', this._blur);
    this.button.addEventListener('input', this._setFilter);
    this.button.addEventListener('change', blockInputChangeEvent);

    this.clear.addEventListener('click', this._clearSelection);

    this.menu.addEventListener('closed', this._deactivate);
  }

  _removeListeners() {
    this.removeEventListener('keydown', this._handleKeydown);
    this.removeEventListener('optionSelected', this._setSelectedOption);
    this.removeEventListener('optionFocused', this._setFocusedOption);

    if (this.button) {
      this.button.removeEventListener('mousedown', this._listenForMouseUp);
      this.button.removeEventListener('focus', this._focus);
      this.button.removeEventListener('blur', this._blur);
      this.button.removeEventListener('input', this._setFilter);
      this.button.removeEventListener('change', blockInputChangeEvent);
    }

    if (this.clear) {
      this.clear.removeEventListener('click', this._clearSelection);
    }

    if (this.menu) {
      this.menu.removeEventListener('closed', this._deactivate);
    }
  }

  _listenForMouseUp(event) {
    event.preventDefault();
    this.button.addEventListener('mouseup', this._toggle);
    this.button.addEventListener('mouseout', this._resetButtonListeners);
  }

  _resetButtonListeners() {
    this.button.removeEventListener('mouseup', this._toggle);
    this.button.removeEventListener('mouseout', this._resetButtonListeners);
  }

  _toggle() {
    if (this.state.disabled) { return; }
    this.button.focus();
    this._dispatchStateChange('toggleOpen');
  }

  _deactivate() {
    this._dispatchStateChange('deactivated');
  }

  _handleKeydown(event) {
    switch (eventKey(event)) {
      case 'Escape':
        if (this.state.open) {
          this._dispatchStateChange('deactivated');
        } else {
          this._dispatchStateChange('clearSelection');
        }
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
        this._dispatchStateChange('optionSelected', this.state.focusedKey);
        break;
      default:
    }
  }

  _clearSelection() {
    this._dispatchStateChange('clearSelection');
  }

  _setSelectedOption(event) {
    event.preventDefault();
    const nextState = SelectState.optionSelected(this.state, event.detail.selectedKey);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { type: 'optionSelected', state: nextState },
    }));
  }

  _setFocusedOption(event) {
    const focusedKey = event.detail.focusedKey;
    const nextState = SelectState.optionFocused(this.state, focusedKey);
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

  _setFilter(event) {
    this.filter = event.target.value;
    this._dispatchStateChange('filter', event.target.value);
  }

  render() {
    this._ensureButton();
    this._ensureMenu();

    applyProps(this.style, {
      zIndex: this.Z_INDEX,
    });

    applyProps(this.menu, {
      open: this.state.open,
      options: SelectState.filteredOptions(this.state),
      top: `${this.offsetTop + this.BUTTON_HEIGHT}px`,
      left: `${this.offsetLeft}px`,
      focusedKey: this.state.focusedKey,
      selectedKey: this.state.selectedKey,
    });


    let label = 'Select';
    const selectedOption = this.state.options.find(o => o.key === this.state.selectedKey);
    if (selectedOption !== undefined) {
      label = selectedOption.label;
    }

    applyProps(this.button, {
      textContent: label,
      placeholder: label,
      value: this.state.filter || null,
      hasFocus: (this.state.hasFocus && !this.state.open),
      disabled: this.state.disabled,
    });

    if (this.state.clearable && this.state.selectedKey) {
      this.insertBefore(this.clear, this.menu);
    } else {
      this.clear.remove();
    }

    super.render();
  }
}

Registry.define('orion-select', Select);

module.exports = Select;
