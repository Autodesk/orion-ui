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
const applyAttrs = require('../utils/apply-attrs.js');
const Element = require('./element');

class Input extends Element {
  constructor() {
    super();
    this.display = 'inline-block';
    applyProps(this, {
      border: 'grey',
      background: 'blue',
    });

    this._dispatchChangeEvent = this._dispatchChangeEvent.bind(this);
  }

  connectedCallback() {
    this._ensureInput();
    this._addListeners();
  }

  disconnectedCallback() {
    this.removeListeners();
  }

  set value(val) {
    this.state.value = val;
    this._queueRender();
  }

  set placeholder(val) {
    this.state.placeholder = val;
    this._queueRender();
  }

  _ensureInput() {
    this.input = this.querySelector('input');
    if (this.input) { return; }

    this.input = document.createElement('input');
    this.appendChild(this.input);
  }

  _addListeners() {
    this.input.addEventListener('change', this._dispatchChangeEvent);
  }

  _removeListeners() {
    this.input.removeEventListener('change', this._dispatchChangeEvent);
  }

  _dispatchChangeEvent(event) {
    event.stopPropagation();
    const nextState = {
      ...this.state,
      value: event.target.value,
    };

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: 'change',
        state: nextState,
      },
    }));
  }

  render() {
    applyAttrs(this.input, {
      value: this.state.value,
      placeholder: this.state.placeholder,
    });
  }
}

Registry.define('orion-input', Input);

module.exports = Input;
