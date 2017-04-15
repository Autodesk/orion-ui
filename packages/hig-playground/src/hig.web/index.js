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
import './HIG.Web.css';
import 'ionicons/css/ionicons.min.css';

class Item {
  constructor(props, mountNode) {
    this._el = document.createElement('button');
    this._el.classList.add('hig-group-item');
    mountNode.appendChild(this._el);

    this.setTitle(props.title);
    this.setOnClick(props.onClick);
    this.setSelected(props.selected);
  }

  teardown() {
    this._el.removeEventListener('click', this._clickListener);
    this._el.parentNode.removeChild(this._el);
  }

  setTitle(title) {
    this._el.innerHTML = title;
  }

  setOnClick(listener) {
    if (!listener) {
      return;
    }

    if (this._clickListener === listener) {
      return;
    } else {
      this._el.removeEventListener('click', this._clickListener);
    }

    this._clickListener = listener;
    this._el.addEventListener('click', this._clickListener);
  }

  setSelected(selected) {
    if (selected) {
      this._el.classList.add('hig-group-item--selected');
    } else {
      this._el.classList.remove('hig-group-item--selected');
    }
  }
}

class Group {
  constructor(props, mountNode) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-group');

    this.setSize(props.size);

    mountNode.appendChild(this._el);
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

  addGroupItem(props) {
    return new Item(props, this._el);
  }

  teardown() {
    this._el.parentNode.removeChild(this._el);
  }
}

class Sidebar {
  constructor(props, mountNode, anchorNode) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-sidebar');

    this.setOpen(props.open);

    mountNode.insertBefore(this._el, anchorNode);
  }

  setOpen(open) {
    if (open) {
      this._el.classList.add('hig-sidebar--open');
    } else {
      this._el.classList.remove('hig-sidebar--open');
    }
  }

  teardown() {
    this._el.parentNode.removeChild(this._el);
  }

  addGroup(props) {
    return new Group(props, this._el);
  }
}

class Top {
  constructor(props, mountNode, anchorNode) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-menu-top');

    this._el.innerHTML = `
      <button class="hig-menu-top-toggle"><i class="ion ion-navicon"></i></button>
    `;

    this._toggleButton = this._el.querySelector('.hig-menu-top-toggle');

    this.setOnToggle(props.onToggle);

    mountNode.insertBefore(this._el, anchorNode);
  }

  setOnToggle(listener) {
    if (!listener) {
      return;
    }

    if (this._toggleListener === listener) {
      return;
    } else {
      this._toggleButton.removeEventListener('click', this._toggleListener);
    }

    this._toggleListener = listener;
    this._toggleButton.addEventListener('click', this._toggleListener);
  }

  teardown() {
    this._el.parentNode.removeChild(this._el);
  }
}

class Slot {
  constructor(props, mountNode, anchorNode) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-slot');

    if (props.className) {
      this._el.classList.add(props.className);
    }

    mountNode.insertBefore(this._el, anchorNode);
  }

  getSlotNode() {
    return this._el;
  }

  teardown() {
    this._el.parentNode.removeChild(this._el);
  }
}

export class Menu {
  constructor(props) {
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

  addSidebar(props) {
    return new Sidebar(props, this._el, this._sidebarAnchor);
  }

  addTop(props) {
    return new Top(props, this._content, this._topAnchor);
  }

  addSlot() {
    return new Slot(
      { className: 'hig-menu-slot' },
      this._content,
      this._slotAnchor
    );
  }

  teardown() {
    this._el.parentNode.removeChild(this._el);
  }
}
