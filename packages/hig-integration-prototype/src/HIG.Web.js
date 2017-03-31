import './HIG.Web.css';

class Item {
  constructor(props, mountNode) {
    this._el1 = document.createElement('div');
    this._el1.classList.add('group-item-top');
    mountNode.appendChild(this._el1);

    this.setTitle(props.title);
    this.setOnClick(props.onClick);

    this._el2 = document.createElement('div');
    this._el2.classList.add('group-item-bottom');

    mountNode.appendChild(this._el2);
  }

  teardown() {
    this._el1.removeEventListener('click', this._clickListener);
    this._el1.parentNode.removeChild(this._el1);
    this._el2.parentNode.removeChild(this._el2);
  }

  setTitle(title) {
    this._el1.innerHTML = title;
  }

  setOnClick(listener) {
    if (!listener) {
      return;
    }

    if (this._clickListener === listener) {
      return;
    } else {
      this._el1.removeEventListener('click', this._clickListener)
    }

    this._clickListener = listener;
    this._el1.addEventListener('click', this._clickListener);
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
  constructor(props, mountNode) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-sidebar');

    this.setOpen(props.open);

    mountNode.appendChild(this._el);
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

class Menu {
  constructor(props, mountNode) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-menu');

    mountNode.appendChild(this._el);
  }

  addSidebar(props) {
    return new Sidebar(props, this._el);
  }
}

export default class HIG {
  constructor(mountNode, anchorNode) {
    this._el = document.createElement('div');
    this._el.classList.add('hig-context');
  }

  mount(mountNode, anchorNode) {
    mountNode.insertBefore(this._el, anchorNode);
  }

  addMenu(props) {
    return new Menu(props, this._el);
  }

  teardown() {
    this._el.parentNode.removeChild(this._el);
  }
}