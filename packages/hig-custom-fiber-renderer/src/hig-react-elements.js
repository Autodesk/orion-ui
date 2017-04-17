import * as HIGWeb from './hig-web';

export class Button {
  constructor(props) {
    this.instance = new HIGWeb.Button();

    if (props.children) {
      this.instance.setLabel(props.children);
    }

    if (props.onClick) {
      this._clickListener = this.instance.setOnClick(props.onClick);
    }
  }

  get root() {
    return this.instance.root;
  }

  mount(mountNode, anchorNode) {
    this.instance.mount(mountNode, anchorNode);
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'children': {
          this.instance.setLabel(propValue);
          break;
        }
        case 'onClick': {
          if (this._clickListener) {
            this._clickListener.dispose();
          }

          this._clickListener = this.instance.setOnClick(propValue);
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
    this.instance = new HIGWeb.MenuTop();

    if (props.onToggle) {
      this._toggleListener = this.instance.setOnToggle(props.onToggle);
    }
  }

  get root() {
    return this.instance.root;
  }

  mount(mountNode, anchorNode) {
    this.instance.mount(mountNode, anchorNode);
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

          this._toggleListener = this.instance.setOnToggle(propValue);
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
    this.instance = new HIGWeb.SidebarItem();

    if (props.children) {
      this.instance.setLabel(props.children);
    }

    if (props.selected) {
      this.instance.setSelected(props.selected);
    }

    if (props.onClick) {
      this._clickListener = this.instance.setOnClick(props.onClick);
    }
  }

  get root() {
    return this.instance.root;
  }

  mount(mountNode, anchorNode) {
    this.instance.mount(mountNode, anchorNode);
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'children': {
          this.instance.setLabel(propValue);
          break;
        }
        case 'selected': {
          this.instance.setSelected(propValue);
          break;
        }
        case 'onClick': {
          if (this._clickListener) {
            this._clickListener.dispose();
          }

          this._clickListener = this.instance.setOnClick(propValue);
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
    this.instance = new HIGWeb.SidebarGroup();

    if (props.small) {
      this.instance.setSize('small');
    }
  }

  get root() {
    return this.instance.root;
  }

  mount(mountNode, anchorNode) {
    this.instance.mount(mountNode, anchorNode);
  }

  appendChild(instance) {
    if (instance instanceof SidebarItem) {
      this.instance.appendItem(instance);
    } else {
      throw new Error('unknown type');
    }
  }

  commitUpdate(updatePayload, oldProps, newProp) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'small': {
          if (propValue) {
            this.instance.setSize('small');
          } else {
            this.instance.setSize('large');
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
    this.instance = new HIGWeb.Sidebar();

    if (props.open) {
      this.instance.setOpen(open);
    }
  }

  get root() {
    return this.instance.root;
  }

  mount(mountNode, anchorNode) {
    this.instance.mount(mountNode, anchorNode);
  }

  commitUpdate(updatePayload, oldProps, newProp) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'open': {
          this.instance.setOpen(propValue);
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

  appendChild(instance) {
    if (instance instanceof SidebarGroup) {
      this.instance.appendGroup(instance);
    } else {
      throw new Error('unknown type');
    }
  }
}

export class Menu {
  constructor(props) {
    this.instance = new HIGWeb.Menu();
  }

  get root() {
    return this.instance.root;
  }

  mount(mountNode, anchorNode) {
    this.instance.mount(mountNode, anchorNode);
  }

  appendChild(instance) {
    if (instance instanceof HIGWeb.Slot) {
      this.instance.appendSlot(instance);
    } else if (instance instanceof MenuTop) {
      this.instance.appendTop(instance);
    } else if (instance instanceof Sidebar) {
      this.instance.appendSidebar(instance);
    } else {
      throw new Error('unknown type');
    }
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    /* no-op */
  }
}
