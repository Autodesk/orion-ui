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

class SelectMenu extends Element {
  constructor() {
    super();

    this.MENU_WIDTH = '100px';

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

  set right(val) {
    this.state.right = val;
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

  set focusedIndex(newValue) {
    this.state.focusedIndex = newValue;
    this._queueRender();
  }

  connectedCallback() {
    this._addHandlers();
  }

  disconnectedCallback() {
    this._removeHandlers();
  }

  _ensurePopover() {
    this._ensureList();
    if (this.popover !== undefined) { return; }

    this.popover = document.createElement('orion-popover');

    this.appendChild(this.popover);
  }

  _ensureList() {
    if (this.list !== undefined) { return; }

    this.list = document.createElement('orion-list');

    applyProps(this.list, {
      itemTagname: 'orion-select-option',
      container: 'column',
      'box-shadow': 1,
    });
  }

  _addHandlers() {
    this._ensurePopover();
    this.popover.addEventListener('clickedAway', this._close);
    this.list.addEventListener('optionSelected', this._cloneEvent);
    this.list.addEventListener('optionFocused', this._cloneEvent);
  }

  _cloneEvent(event) {
    this.dispatchEvent(new CustomEvent(event.type, event));
  }

  _removeHandlers() {
    this.popover.removeEventListener('clickedAway', this._close);
    this.list.removeEventListener('optionSelected', this._cloneEvent);
    this.list.removeEventListener('optionFocused', this._cloneEvent);
  }

  _close() {
    this.dispatchEvent(new CustomEvent('closed'));
  }

  _render() {
    this._ensurePopover();

    applyProps(this.popover, {
      top: this.state.top,
      left: this.state.left,
      width: this.MENU_WIDTH,
      content: this.list,
      open: this.state.open,
    });

    const options = this.state.options.map((option, i) => {
      option.hasFocus = (i === this.state.focusedIndex);
      option.index = i;
      return option;
    });

    applyProps(this.list, {
      items: options,
    });

    super._render();
  }
}

Registry.define('orion-select-menu', SelectMenu);

module.exports = SelectMenu;
