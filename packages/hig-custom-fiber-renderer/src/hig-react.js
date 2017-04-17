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
import { connectToDevTools } from 'react-devtools-core';

connectToDevTools({
  host: 'localhost',
  port: 3000
});

import React, { Component } from 'react';
import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import {
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode
} from 'react-dom';

import * as HIGWeb from './hig-web';

/**
 * HIG Fiber Renderer
 */

const types = {
  BUTTON: 'hig-button',
  MENU: 'hig-menu',
  MENU_TOP: 'hig-menu-top',
  BASE_SLOT: 'hig-slot'
};

class ButtonWrapper {
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

class MenuTopWrapper {
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

class MenuWrapper {
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
    } else if (instance instanceof MenuTopWrapper) {
      this.instance.appendTop(instance);
    } else {
      throw new Error('unknown type');
    }
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    /* no-op */
  }
}

const HIGRenderer = ReactFiberReconciler({
  useSyncScheduling: true,

  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    switch (type) {
      case types.BASE_SLOT:
        return new HIGWeb.Slot(props);
      case types.MENU:
        return new MenuWrapper(props);
      case types.MENU_TOP:
        return new MenuTopWrapper(props);
      case types.BUTTON:
        return new ButtonWrapper(props);
      default:
        throw new Error(`Unknown type ${type}`);
    }
  },

  getPublicInstance(instance) {
    if (instance.getDOMNode) {
      return instance.getDOMNode();
    } else {
      console.error('no DOM node available');
    }
  },

  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  finalizeInitialChildren(newElement, type, props, rootContainerInstance) {
    return false;
  },

  appendChild(parentInstance, child) {
    if (parentInstance instanceof HTMLElement && child.root) {
      child.mount(parentInstance, null);
    } else {
      parentInstance.appendChild(child);
    }
  },

  insertBefore(parentInstance, child, beforeChild) {
    debugger;
    // do insert
  },

  removeChild(parentInstance, child) {
    debugger;
    // do remove
  },

  shouldSetTextContent(props) {
    if (typeof props.children === 'string') {
      return true;
    } else {
      return false;
    }
  },

  resetTextContent(element) {
    debugger;
    // no-op
  },

  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    debugger;
  },

  commitTextUpdate(textElement, oldText, newText) {
    debugger;
    // do commit
  },

  // create context to provide to children
  getRootHostContext(rootContainerInstance) {
    return rootContainerInstance;
  },

  getChildHostContext(parentHostContext, type) {
    return parentHostContext;
  },

  // turn off event handlers (in react-dom)
  prepareForCommit() {
    // no-op
  },

  commitMount(instance, type, newProps, internalInstanceHandle) {
    debugger;
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    hostContext
  ) {
    // example
    // const oldProps = { label: 'foo' }
    // const newProps = { label: 'bar', onClick: 'foo' };

    const updatePayload = [];
    const mergedProps = {};

    // Fill out the initial props
    for (const propKey in oldProps) {
      mergedProps[propKey] = [oldProps[propKey], null];
    }

    // example
    // mergedProps =  { label: ['foo', null] }

    // Now overwrite the changes
    for (const propKey in newProps) {
      // When prop exists overwrite the value
      if (mergedProps[propKey] !== undefined) {
        mergedProps[propKey][1] = newProps[propKey];
      } else {
        mergedProps[propKey] = [null, newProps[propKey]];
      }
    }

    // example
    // mergedProps = { label: ['foo', 'bar'], onClick: [null, 'foo']}

    // Compare differences
    for (const propKey in mergedProps) {
      const [oldVal, newVal] = mergedProps[propKey];

      if (oldVal !== newVal) {
        updatePayload.push(propKey, newVal);
      }
    }

    // example
    // updatePayload = ['label', 'bar', 'onClick', 'foo']

    if (updatePayload.length === 0) {
      return null;
    } else {
      return updatePayload;
    }
  },

  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle
  ) {
    instance.commitUpdate(updatePayload, oldProps, newProps);
  },

  // turn on event handlers (in react-dom)
  resetAfterCommit() {},

  scheduleAnimationCallback(fn) {
    debugger;
    setTimeout(fn);
  },

  scheduleDeferredCallback(fn) {
    setTimeout(fn, 0, { timeRemaining: () => Infinity });
  }
});

/**
 * React Components
 */
export default class HIG extends Component {
  componentDidMount() {
    // Pass the new HIGWeb instance to a custom fiber renderer container
    this._mountNode = HIGRenderer.createContainer(this._higRef);

    // Update the container with the react children
    // This is equal to ReactDOM.render I think
    HIGRenderer.updateContainer(this.props.children, this._mountNode, this);
  }

  componentDidUpdate(prevProps, prevState) {
    HIGRenderer.updateContainer(this.props.children, this._mountNode, this);
  }

  componentWillUnmount() {
    HIGRenderer.updateContainer(null, this._mountNode, this);
  }

  render() {
    return <hig-web ref={ref => this._higRef = ref} />;
  }
}

export const Button = types.BUTTON;
export const Menu = types.MENU;
export const MenuTop = types.MENU_TOP;

export class Slot extends Component {
  componentDidMount() {
    this.renderSlot(this.props);
  }

  renderSlot(props) {
    const parentComponent = this;
    const element = props.children;
    const container = this._higRef;

    unstable_renderSubtreeIntoContainer(parentComponent, element, container);
  }

  componentWillUnmount() {
    unmountComponentAtNode(this._higRef);
  }

  componentWillReceiveProps(nextProps) {
    this.renderSlot(nextProps);
  }

  render() {
    return <hig-slot ref={ref => this._higRef = ref} />;
  }
}
