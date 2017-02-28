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

const Registry = require('../utils/private-registry.js');
const applyProps = require('../utils/apply-props.js');
const Element = require('./element.js');

class SelectMenu extends Element {
  constructor() {
    super();

    this.MENU_MIN_WIDTH = '100px';
    this.OPTION_HEIGHT = 26;
    this.MAX_OPTIONS_VISIBLE = 6;

    ['_cloneEvent', '_close'].forEach((handler) => {
      this[handler] = this[handler].bind(this);
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

  set left(val) {
    this.state.left = val;
    this._queueRender();
  }

  set width(val) {
    this.state.width = val;
    this._queueRender();
  }

  set open(val) {
    this.state.open = val;
    this._queueRender();
  }

  set focusedKey(newValue) {
    this.state.focusedKey = newValue;
    this._queueRender();
  }

  set selectedKey(newValue) {
    this.state.selectedKey = newValue;
    this._queueRender();
  }

  connectedCallback() {
    this._ensureList();
  }

  _ensureList() {
    if (this.list !== undefined) { return; }

    this.list = document.createElement('orion-list');

    applyProps(this.list, {
      itemTagname: 'orion-select-option',
      container: 'column',
      'box-shadow': 1,
      'overflow-y': 'auto',
      position: 'absolute',
    });
    this.list.style.maxHeight = `${this.OPTION_HEIGHT * this.MAX_OPTIONS_VISIBLE}px`;
  }

  _removeList() {
    if (this.list !== undefined) { this.list.remove(); }
  }

  _cloneEvent(event) {
    this.dispatchEvent(new CustomEvent(event.type, event));
  }

  _close() {
    this.dispatchEvent(new CustomEvent('closed'));
  }

  render() {
    this._ensureList();

    if (this.state.open) {
      const options = this.state.options.map((option) => {
        option.hasFocus = (option.key === this.state.focusedKey);
        option.isSelected = (option.key === this.state.selectedKey);
        return option;
      });

      applyProps(this.list, {
        items: options,
      });

      applyProps(this.list.style, {
        minWidth: this.MENU_MIN_WIDTH,
      });

      if (!this.contains(this.list)) {
        this.appendChild(this.list);
      }
    } else {
      this._removeList();
    }

    super.render();
  }
}

Registry.define('orion-select-menu', SelectMenu);

module.exports = SelectMenu;
