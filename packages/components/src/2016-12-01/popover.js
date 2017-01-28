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
const clearChildren = require('../utils/clear-children.js');
const PopoverState = require('./popover-state.js');

class Popover extends Element {
  constructor() {
    super();

    this.state = PopoverState.getInitialState();

    this._close = this._close.bind(this);
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

  set content(val) {
    this.state.content = val;
    this._queueRender();
  }

  set open(val) {
    this.state.open = val;
    this._queueRender();
  }

  disconnectedCallback() {
    if (this.clickTrap !== undefined) {
      this.clickTrap.removeEventListener('click', this._close);
    }
    this._removeChildren();
  }

  _addClickTrapListeners() {
    this._ensureClickTrap();

    this.clickTrap.addEventListener('click', this._close);
  }

  _ensureClickTrap() {
    if (this.clickTrap !== undefined) { return; }

    this.clickTrap = document.createElement('orion-element');
    this.clickTrap.addAttribute('data-test-id', 'orion-popover__click-trap');
    this.clickTrap.position = 'cover';
  }

  _ensureFrame() {
    if (this.frame !== undefined) { return; }

    this.frame = document.createElement('orion-element');
    this.clickTrap.addAttribute('data-test-id', 'orion-popover__content');
    this.frame.position = 'absolute';
  }

  _close() {
    this.dispatchEvent(new CustomEvent('clickedAway'));
  }

  _removeChildren() {
    if (this.frame !== undefined) {
      this.frame.remove();
    }

    if (this.clickTrap !== undefined) {
      this.clickTrap.remove();
    }
  }

  _render() {
    if (this.state.open) {
      this._addClickTrapListeners();
      this._ensureFrame();

      this.frame.style.top = this.state.top;
      this.frame.style.left = this.state.left;
      this.frame.style.width = this.state.width;

      this._setContent();

      document.body.appendChild(this.clickTrap);
      document.body.appendChild(this.frame);
    } else {
      this._removeChildren();
    }

    super._render();
  }

  _setContent() {
    clearChildren(this.frame);

    this.frame.appendChild(this.state.content);
  }
}

Registry.define('orion-popover', Popover);

module.exports = Popover;
