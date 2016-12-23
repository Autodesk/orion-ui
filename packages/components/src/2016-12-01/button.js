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
        dim
        pointer><slot /></orion-inline>
    `;
    this.shadowEl = shadowRoot.children[0];
  }

  static get observedAttributes() {
    return ['background', 'color', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowEl.setAttribute(name, newValue);
  }
}

Registry.define('orion-button', Button);

module.exports = Button;
