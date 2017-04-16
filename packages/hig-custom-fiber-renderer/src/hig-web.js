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
export class Button {
  root = true;

  constructor() {
    this._el = document.createElement('button');
    this._el.classList.add('hig-button');
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  setLabel(label) {
    this._el.textContent = label;
  }

  setOnClick(listener) {
    this._el.addEventListener('click', listener);

    return {
      dispose: () => this._el.removeEventListener('click', listener)
    };
  }
}

export class Slot {
  root = false;

  constructor(props) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-slot');

    if (props.className) {
      this._el.classList.add(props.className);
    }
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  getDOMNode() {
    return this._el;
  }
}

export class Menu {
  root = true;

  constructor(props) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-menu');
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  _appendSlot(instance, anchorNode) {
    instance.mount(this._el, null);
  }

  appendChild(instance) {
    if (instance instanceof Slot) {
      this._appendSlot(instance);
    } else {
      throw new Error('unknown element type');
    }
  }
}
