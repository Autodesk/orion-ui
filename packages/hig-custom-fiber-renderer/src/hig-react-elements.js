import * as HIGWeb from './hig-web';

export class Button {
  constructor(props) {
    this.hig = new HIGWeb.Button();

    if (props.children) {
      this.hig.setLabel(props.children);
    }

    if (props.onClick) {
      this._clickListener = this.hig.setOnClick(props.onClick);
    }
  }

  mount(mountNode, anchorNode) {
    this.hig.mount(mountNode, anchorNode);
  }

  unmount() {
    if (this._clickListener) {
      this._clickListener.dispose();
    }
    this.hig.unmount();
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'children': {
          this.hig.setLabel(propValue);
          break;
        }
        case 'onClick': {
          if (this._clickListener) {
            this._clickListener.dispose();
          }

          this._clickListener = this.hig.setOnClick(propValue);
          break;
        }
        default: {
          console.warn(`${propKey} is unknown`);
        }
      }
    }
  }
}

export class MenuTop {
  constructor(props) {
    this.hig = new HIGWeb.MenuTop();

    if (props.onToggle) {
      this._toggleListener = this.hig.setOnToggle(props.onToggle);
    }
  }

  mount(mountNode, anchorNode) {
    this.hig.mount(mountNode, anchorNode);
  }

  unmount() {
    if (this._toggleListener) {
      this._toggleListener.dispose();
    }

    this.hig.unmount();
  }

  commitUpdate(updatePayload, oldProps, newProp) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'onToggle': {
          if (this._toggleListener) {
            this._toggleListener.dispose();
          }

          this._toggleListener = this.hig.setOnToggle(propValue);
          break;
        }
        default: {
          console.warn(`${propKey} is unknown`);
        }
      }
    }
  }
}

export class SidebarItem {
  constructor(props) {
    this.hig = new HIGWeb.SidebarItem();

    if (props.children) {
      this.hig.setLabel(props.children);
    }

    if (props.selected) {
      this.hig.setSelected(props.selected);
    }

    if (props.onClick) {
      this._clickListener = this.hig.setOnClick(props.onClick);
    }
  }

  mount(mountNode, anchorNode) {
    this.hig.mount(mountNode, anchorNode);
  }

  unmount() {
    if (this._clickListener) {
      this._clickListener.dispose();
    }
    this.hig.unmount();
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'children': {
          this.hig.setLabel(propValue);
          break;
        }
        case 'selected': {
          this.hig.setSelected(propValue);
          break;
        }
        case 'onClick': {
          if (this._clickListener) {
            this._clickListener.dispose();
          }

          this._clickListener = this.hig.setOnClick(propValue);
          break;
        }
        default: {
          console.warn(`${propKey} is unknown`);
        }
      }
    }
  }
}

export class SidebarGroup {
  constructor(props) {
    this.hig = new HIGWeb.SidebarGroup();

    if (props.small) {
      this.hig.setSize('small');
    }
  }

  mount(mountNode, anchorNode) {
    this.hig.mount(mountNode, anchorNode);
  }

  unmount() {
    this.hig.unmount();
  }

  appendChild(instance, beforeChild = {}) {
    if (instance instanceof SidebarItem) {
      this.hig.appendItem(instance.hig, beforeChild.hig);
    } else {
      throw new Error('unknown type');
    }
  }

  insertBefore(instance, beforeChild) {
    this.appendChild(instance, beforeChild);
  }

  removeChild(instance) {
    instance.remove();
  }

  commitUpdate(updatePayload, oldProps, newProp) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'small': {
          if (propValue) {
            this.hig.setSize('small');
          } else {
            this.hig.setSize('large');
          }
          break;
        }
        case 'children': {
          /* no-op */
          break;
        }
        default: {
          console.warn(`${propKey} is unknown`);
        }
      }
    }
  }
}

export class Sidebar {
  constructor(props) {
    this.hig = new HIGWeb.Sidebar();

    if (props.open) {
      this.hig.setOpen(open);
    }
  }

  mount(mountNode, anchorNode) {
    this.hig.mount(mountNode, anchorNode);
  }

  unmount() {
    this.hig.unmount();
  }

  commitUpdate(updatePayload, oldProps, newProp) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'open': {
          this.hig.setOpen(propValue);
          break;
        }
        case 'children': {
          /* no-op */
          break;
        }
        default: {
          console.warn(`${propKey} is unknown`);
        }
      }
    }
  }

  appendChild(instance, beforeChild = {}) {
    if (instance instanceof SidebarGroup) {
      this.hig.appendGroup(instance.hig, beforeChild.hig);
    } else {
      throw new Error('unknown type');
    }
  }

  insertBefore(instance, beforeChild) {
    this.appendChild(instance, beforeChild);
  }
}

export class Slot {
  constructor() {
    this.hig = new HIGWeb.Slot();
  }

  getDOMNode() {
    return this.hig.getDOMNode();
  }

  mount(mountNode, anchorNode) {
    this.hig.mount(mountNode, anchorNode);
  }

  unmount() {
    this.hig.unmount();
  }
}

export class Menu {
  constructor(props) {
    this.hig = new HIGWeb.Menu();
  }

  mount(mountNode, anchorNode) {
    this.hig.mount(mountNode, anchorNode);
  }

  unmount() {
    this.hig.unmount();
  }

  appendChild(instance, beforeChild = {}) {
    if (instance instanceof Slot) {
      this.hig.appendSlot(instance.hig, beforeChild.hig);
    } else if (instance instanceof MenuTop) {
      this.hig.appendTop(instance.hig, beforeChild.hig);
    } else if (instance instanceof Sidebar) {
      this.hig.appendSidebar(instance.hig, beforeChild.hig);
    } else {
      throw new Error('unknown type');
    }
  }

  insertBefore(instance, beforeChild) {
    this.appendChild(instance, beforeChild);
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    /* no-op */
  }
}

const elements = {
  'hig-slot': Slot,
  'hig-button': Button,
  'hig-menu': Menu,
  'hig-menu-top': MenuTop,
  'hig-sidebar': Sidebar,
  'hig-sidebar-group': SidebarGroup,
  'hig-sidebar-item': SidebarItem
};

export function createElement(type, props) {
  if (elements[type]) {
    return new elements[type](props);
  } else {
    throw new Error(`Unknown type ${type}`);
  }
}
