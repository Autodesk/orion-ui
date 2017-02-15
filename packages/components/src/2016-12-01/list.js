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
const clearChildren = require('../utils/clear-children.js');
const Registry = require('../utils/private-registry.js');

function hashFromItems(items) {
  return items.reduce((memo, item) => { return memo + item.key; }, '');
}

class List extends Element {
  constructor() {
    super();

    this.display = 'block';
  }

  set items(newOptions) {
    this.state.items = newOptions;
    this._queueRender();
  }

  get items() {
    return this.state.items || [];
  }

  set itemTagname(newValue) {
    this.state.itemTagname = newValue;
    this._queueRender();
  }

  get itemTagname() {
    return this.state.itemTagname;
  }

  render() {
    // TODO: raise warning if no key
    // TODO: raise warning if duplicate key

    if (this.lastItemsHash !== hashFromItems(this.items)) {
      clearChildren(this);
    }

    this.items.forEach((item) => {
      let itemEl = this.querySelector(`[data-key="${item.key}"]`);
      if (itemEl === null) {
        itemEl = document.createElement(this.state.itemTagname);
        itemEl.setAttribute('data-key', item.key);
        this.appendChild(itemEl);
      }
      applyProps(itemEl, item);
    });

    this.lastItemsHash = hashFromItems(this.items);
    super.render();
  }
}

Registry.define('orion-list', List);

module.exports = List;
