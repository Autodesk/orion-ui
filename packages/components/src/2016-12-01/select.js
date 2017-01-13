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
require('./button');
require('./select-options');
const Element = require('./element');
const SelectState = require('./select-state.js');

const Registry = require('../utils/private-registry.js');

class Select extends Element {
  constructor() {
    super();

    this.state = SelectState.getInitialState();

    this.shadowEl.addEventListener('click', () => {
      const nextState = SelectState.activated(this.state);
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          type: 'activated',
          state: nextState,
        },
      }));
    });
  }

  initMenu() {
    this.menu = document.createElement('orion-select-options');
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

  set options(newOptions) {
    this.state.options = newOptions;
    this._queueRender();
  }

  set open(newValue) {
    this.state.open = newValue;
    this._queueRender();
  }

  _render() {
    if (this.state.open) {
      if (typeof this.menu === 'undefined') { this.initMenu(); }

      this.menu.options = this.state.options;
      this.menu.top = `${this.offsetTop + this.offsetHeight}px`;
      this.menu.left = `${this.offsetLeft}px`;
      this.menu.width = `${this.offsetWidth}px`;
      document.body.appendChild(this.menu);
    } else if (typeof this.menu !== 'undefined') {
      this.menu.remove();
    }
    super._render();
  }
}

Select.prototype.shadowSpec = {
  innerHTML: `
    <orion-button background="black" color="white">Select</orion-button>
  `,
  props: {},
};

Registry.define('orion-select', Select);

module.exports = Select;
