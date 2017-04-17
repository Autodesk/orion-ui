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
import './hig-web.css';
import 'ionicons/css/ionicons.min.css';

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

  constructor() {
    this._el = document.createElement('div');
    this._el.classList.add('hig-slot');
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

  constructor() {
    this._el = document.createElement('div');
    this._el.classList.add('hig-menu');

    /**
     * Basic Structure:
     * - sidebar
     * - content
     *   - top
     *   - slot
     */

    this._sidebarAnchor = document.createComment('sidebar-anchor');

    this._content = document.createElement('div');
    this._content.classList.add('hig-menu-content');

    this._topAnchor = document.createComment('top-anchor');
    this._slotAnchor = document.createComment('slot-anchor');

    this._el.appendChild(this._sidebarAnchor);
    this._el.appendChild(this._content);

    this._content.appendChild(this._topAnchor);
    this._content.appendChild(this._slotAnchor);
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  appendSlot(instance) {
    instance.mount(this._content, this._slotAnchor);
  }

  appendTop(instance) {
    instance.mount(this._content, this._topAnchor);
  }

  appendSidebar(instance) {
    instance.mount(this._el, this._sidebarAnchor);
  }
}

export class MenuTop {
  root = false;

  constructor() {
    this._el = document.createElement('div');
    this._el.classList.add('hig-menu-top');

    this._el.innerHTML = `
      <button class="hig-menu-top-toggle"><i class="ion ion-navicon"></i></button>
    `;

    this._toggleButton = this._el.querySelector('.hig-menu-top-toggle');
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  setOnToggle(listener) {
    this._toggleButton.addEventListener('click', listener);

    return {
      dispose: () => this._toggleButton.removeEventListener('click', listener)
    };
  }
}

export class Sidebar {
  root = false;

  constructor() {
    this._el = document.createElement('div');
    this._el.classList.add('hig-sidebar');
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  setOpen(open) {
    if (open) {
      this._el.classList.add('hig-sidebar--open');
    } else {
      this._el.classList.remove('hig-sidebar--open');
    }
  }

  appendGroup(instance) {
    instance.mount(this._el, null);
  }
}

export class SidebarGroup {
  root = false;

  constructor() {
    this._el = document.createElement('div');
    this._el.classList.add('hig-sidebar-group');
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  setSize(size) {
    this._el.classList.remove('hig-group--large');
    this._el.classList.remove('hig-group--small');

    switch (size) {
      case 'small':
        this._el.classList.add('hig-group--small');
        break;
      default:
        this._el.classList.add('hig-group--large');
    }
  }

  appendItem(instance) {
    instance.mount(this._el, null);
  }
}

export class SidebarItem {
  root = false;

  constructor() {
    this._el = document.createElement('button');
    this._el.classList.add('hig-group-item');
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  setLabel(label) {
    console.log(`setLabel ${label}`);
    this._el.textContent = label;
  }

  setOnClick(listener) {
    console.log(`setOnClick`);
    this._el.addEventListener('click', listener);

    return {
      dispose: () => this._el.removeEventListener('click', listener)
    };
  }

  setSelected(selected) {
    if (selected) {
      this._el.classList.add('hig-group-item--selected');
    } else {
      this._el.classList.remove('hig-group-item--selected');
    }
  }
}
