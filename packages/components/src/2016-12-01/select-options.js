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
require('./list');
require('./select-option');
require('./popover.js');

const Registry = require('../utils/private-registry.js');
const applyProps = require('../utils/apply-props.js');
const Element = require('./element.js');

class SelectOptions extends Element {
  constructor() {
    super();

    this.menu = this.shadowRoot.getElementById('menu');
    this.menu.addEventListener('clickedAway', (event) => {
      this.dispatchEvent(new CustomEvent('closed'));
    });

    this.list = this.shadowRoot.getElementById('list');
    applyProps(this.list, {
      itemTagname: 'orion-select-option',
      container: 'column',
    });
  }

  set options(newOptions) {
    this.state.options = newOptions;
    this._queueRender();
  }

  set top(val) {
    this.state.top = val;
    this._queueRender();
  }

  set right(val) {
    this.state.right = val;
    this._queueRender();
  }

  set width(val) {
    this.state.width = val;
    this._queueRender();
  }

  _render() {
    this.list.items = this.state.options;
    this.menu.top = this.state.top;
    this.menu.left = this.state.left;
    this.menu.width = this.state.width;
    super._render();
  }
}

SelectOptions.prototype.shadowSpec = {
  innerHTML: `
    <orion-popover id="menu">
      <orion-list id="list"></orion-list>
    </orion-popover>
  `,
  props: {},
};

Registry.define('orion-select-options', SelectOptions);

module.exports = SelectOptions;
