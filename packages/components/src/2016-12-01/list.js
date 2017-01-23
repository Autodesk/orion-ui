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
const applyProps = require('../utils/apply-props');
const Registry = require('../utils/private-registry.js');

class List extends Element {
  constructor() {
    super();

    this.state = { items: [] };
  }

  set items(newOptions) {
    this.state.items = newOptions;
    this._queueRender();
  }

  set itemTagname(newValue) {
    this.state.itemTagname = newValue;
    this._queueRender();
  }

  _render() {
    // TODO: raise warning if no key
    // TODO: raise warning if duplicate key

    this.state.items.forEach((item) => {
      let itemEl = this.querySelector(`[data-key="${item.key}"]`);
      if (itemEl === null) {
        itemEl = document.createElement(this.state.itemTagname);
        itemEl.setAttribute('data-key', item.key);
        this.appendChild(itemEl);
      }
      applyProps(itemEl, item);
    });

    super._render();
  }
}

Registry.define('orion-list', List);

module.exports = List;
