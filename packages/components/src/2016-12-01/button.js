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
require('./inline');
const ButtonState = require('./button-state.js');

const Registry = require('../utils/private-registry.js');

class Button extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <orion-inline
        border-radius="2"
        background="white"
        color="black"
        padding-horizontal="3"
        padding-vertical="2"
        pointer><slot /></orion-inline>
    `;
    this.shadowEl = shadowRoot.children[0];

    this.addEventListener('mouseenter', () => {
      if (this.state.disabled) { return; }
      const nextState = ButtonState.enterHover(this.state);
      this.dispatchEvent(new CustomEvent('change', { detail: nextState }));
    });

    this.addEventListener('mouseleave', () => {
      const nextState = ButtonState.leaveHover(this.state);
      this.dispatchEvent(new CustomEvent('change', { detail: nextState }));
    });

    this.addEventListener('click', (event) => {
      if (this.state.disabled) {
        event.stopImmediatePropagation();
      }
    });
  }

  get state() {
    return {
      hover: this.hover,
      disabled: this.disabled,
    };
  }

  static get observedAttributes() {
    return ['background', 'color', 'disabled', 'hover'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'disabled':
        this.disabled = newValue === 'true';
        this.handleDisabledChange(newValue);
        break;
      case 'hover':
        this.hover = newValue === 'true';
        this.render(this.state);
        break;
      default:
        this[name] = newValue;
        this.render(this.state);
        break;
    }
  }

  handleDisabledChange(newValue) {
    let nextState;
    if (newValue === 'true') {
      nextState = ButtonState.enterDisabled(this.state);
    } else {
      nextState = ButtonState.leaveDisabled(this.state);
    }
    this.render(nextState);
  }

  render(state) {
    if (state.disabled) {
      this.shadowEl.background = 'grey';
      this.shadowEl.color = 'white';
    } else if (state.hover) {
      this.shadowEl.background = 'blue';
      this.shadowEl.color = 'white';
    } else {
      this.shadowEl.background = this.background;
      this.shadowEl.color = this.color;
    }
  }
}

Registry.define('orion-button', Button);

module.exports = Button;
