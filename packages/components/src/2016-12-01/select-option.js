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
const applyProps = require('../utils/apply-props');
const Element = require('./element.js');
const ButtonState = require('./button-state.js');

class SelectOption extends Element {
  constructor() {
    super();

    this._passButtonState = this._passButtonState.bind(this);
  }

  set label(newValue) {
    this.state.label = newValue;
    this._queueRender();
  }

  connectedCallback() {
    this._ensureButton();
    this.button.addEventListener('change', this._passButtonState);
  }

  disconnectedCallback() {
    applyProps(this.button, ButtonState.getInitialState());
    this.button.removeEventListener('change', this._passButtonState);
  }

  _passButtonState(event) {
    applyProps(this.button, event.detail.state);
  }

  _ensureButton() {
    if (this.button !== undefined) { return; }

    this.button = document.createElement('orion-button');
    applyProps(this.button, {
      display: 'block',
      'border-radius': '0',
      size: 'small',
      background: 'white',
      color: 'black',
    });

    this.appendChild(this.button);
  }

  _render() {
    if (this.button !== undefined) {
      this.button.textContent = this.state.label;
    }

    super._render();
  }
}

Registry.define('orion-select-option', SelectOption);

module.exports = SelectOption;
