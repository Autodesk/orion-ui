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
const Registry = require('../utils/private-registry.js');
const applyProps = require('../utils/apply-props.js');
const Element = require('./element');
const InputState = require('./input-state');

class Input extends Element {
  constructor() {
    super();
    this.display = 'inline-block';
    applyProps(this, {
      border: 'grey',
      background: 'blue',
    });

    ['_dispatchChangeEvent', '_dispatchClearEvent'].forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
  }

  connectedCallback() {
    this._ensureInput();
    this._ensureClear();
    this._addListeners();
  }

  disconnectedCallback() {
    this.removeListeners();
  }

  set value(val) {
    this.state.value = val;
    this._queueRender();
  }

  get value() {
    return this.state.value || '';
  }

  set placeholder(val) {
    this.state.placeholder = val;
    this._queueRender();
  }

  get placeholder() {
    return this.state.placeholder || '';
  }

  set clearable(val) {
    this.state.clearable = val;
    this._queueRender();
  }

  _ensureInput() {
    this.input = this.querySelector('input');
    if (this.input) { return; }

    this.input = document.createElement('input');
    this.appendChild(this.input);
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
    this.input.addEventListener('change', this._dispatchChangeEvent);
    this.clear.addEventListener('click', this._dispatchClearEvent);
  }

  _removeListeners() {
    this.input.removeEventListener('change', this._dispatchChangeEvent);

    if (this.clear) {
      this.clear.removeEventListener('click', this._dispatchClearEvent);
    }
  }

  _dispatchClearEvent() {
    event.stopPropagation();
    const nextState = InputState.clear(this.state);

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: 'change',
        state: nextState,
      },
    }));
  }

  _dispatchChangeEvent(event) {
    event.stopPropagation();
    const nextState = InputState.updateValue(this.state, event.target.value);

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: 'change',
        state: nextState,
      },
    }));
  }

  render() {
    applyProps(this.input, {
      value: this.value,
      placeholder: this.placeholder,
    });

    if (this.state.clearable && this.state.value) {
      this.insertBefore(this.clear, this.menu);
    } else {
      this.clear.remove();
    }
  }
}

Registry.define('orion-input', Input);

module.exports = Input;
