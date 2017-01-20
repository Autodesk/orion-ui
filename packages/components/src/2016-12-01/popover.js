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
const Element = require('./element');
const Registry = require('../utils/private-registry.js');
const PopoverState = require('./popover-state.js');

class Popover extends Element {
  constructor() {
    super();

    this.state = PopoverState.getInitialState();

    this.clickTrap = this.shadowRoot.getElementById('click-trap');
    this.content = this.shadowRoot.getElementById('content');

    this.clickTrap.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('clickedAway'));
    });
  }

  set top(val) {
    this.state.top = val;
    this._queueRender();
  }

  set left(val) {
    this.state.left = val;
    this._queueRender();
  }

  set width(val) {
    this.state.width = val;
    this._queueRender();
  }

  _render() {
    this.content.shadowEl.style.top = this.state.top;
    this.content.shadowEl.style.left = this.state.left;
    this.content.shadowEl.style.width = this.state.width;
    super._render();
  }
}

Popover.prototype.shadowSpec = {
  innerHTML: `
    <orion-element id="click-trap" position="cover"></orion-element>
    <orion-element id="content" position="absolute"><slot /></orion-element>
  `,
  props: {},
};

Registry.define('orion-popover', Popover);

module.exports = Popover;
