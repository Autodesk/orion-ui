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

class Select extends Element {
  constructor() {
    super();

    this.BUTTON_HEIGHT = 35;

    this.state = SelectState.getInitialState();
    this.display = 'inline-block';

    ['_handleKeydown', '_handleBlur', '_activate'].forEach((handler) => {
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

  connectedCallback() {
    this._ensureButton();
    this._addListeners();
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  _ensureButton() {
    if (this.button !== undefined) { return; }

    this.button = document.createElement('orion-button');
    applyProps(this.button, {
      skin: 'black',
      textContent: 'Select',
    });

    this.appendChild(this.button);
  }

  _addListeners() {
    this.addEventListener('keydown', this._handleKeydown);
    this.addEventListener('click', this._activate);
    this.button.addEventListener('blur', this._handleBlur);
  }

  _removeListeners() {
    this.removeEventListener('keydown', this._handleKeydown);
    this.removeEventListener('click', this._activate);
    this.button.removeEventListener('blur', this._handleBlur);
  }

  _activate() {
    const nextState = SelectState.activated(this.state);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { type: 'activated', state: nextState },
    }));
  }

  _handleKeydown(event) {
    let nextState;
    switch (event.key) {
      case 'Escape':
        nextState = SelectState.deactivated(this.state);
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            type: 'deactivated',
            state: nextState,
          },
        }));
        break;
      case 'ArrowUp':
        nextState = SelectState.focusPrevious(this.state);
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            type: 'focusPrevious',
            state: nextState,
          },
        }));
        break;
      case 'ArrowDown':
        nextState = SelectState.focusNext(this.state);
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            type: 'focusNext',
            state: nextState,
          },
        }));
        break;
      default:
    }
  }

  _handleBlur() {
    const nextState = SelectState.deactivated(this.state);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { type: 'deactivated', state: nextState },
    }));
  }

  _ensureMenu() {
    if (this.menu !== undefined) { return; }

    this.menu = document.createElement('orion-select-menu');
    this.appendChild(this.menu);

    this.menu.addEventListener('closed', () => {
      const nextState = SelectState.deactivated(this.state);
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          type: 'deactivated',
          state: nextState,
        },
      }));
    });
  }

  _render() {
    this._ensureMenu();

    applyProps(this.menu, {
      open: this.state.open,
      options: this.state.options,
      top: `${this.offsetTop + this.BUTTON_HEIGHT}px`,
      left: `${this.offsetLeft}px`,
    });

    super._render();
  }
}

Registry.define('orion-select', Select);

module.exports = Select;
