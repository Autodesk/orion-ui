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

import HIGWeb from './hig-web';

/**
 * HIG Fiber Renderer
 */

const types = {
  BUTTON: 'hig-button',
  MENU: 'hig-menu',
  BASE_SLOT: 'hig-slot'
};

class HIGContext {
  constructor(hig, parent) {
    this.parent = parent;
    this.hig = hig;
    this.children = [];
  }

  createInstance(type, props) {
    switch (type) {
      case types.BUTTON: {
        const instance = this.hig.addButton();
        instance._applyProps = applyButtonProps;
        instance._applyProps(instance, props);

        // Store instance for later child creation
        this.children.push([type, instance]);

        return instance;
      }

      case types.MENU: {
        const instance = this.hig.addMenu();
        instance._applyProps = applyMenuProps;
        instance._applyProps(instance, props);

        // Store instance for later child creation
        this.children.push([type, instance]);

        return instance;
      }
      default:
        throw new Error('unknown type');
    }
  }

  transition(type) {
    // find the hig instance. Create a new HIGContext
    const matchChild = this.children.find(child => {
      debugger;
    });

    if (!matchChild) {
      throw new Error(`could not transition to ${type}`);
    }

    return new HIGContext(instance, this);
  }
}

function applyButtonProps(instance, props, prevProps = {}) {
  if (props.children) {
    instance.setLabel(props.children);
  }

  if (prevProps.onClick) {
    instance._onClick.dispose();
  }

  if (props.onClick) {
    instance._onClick = instance.setOnClick(props.onClick);
  }
}

function applyMenuProps(instance, props, prevProps = {}) {}

const HIGRenderer = ReactFiberReconciler({
  useSyncScheduling: true,

  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    return hostContext.createInstance(type, props);
  },

  appendInitialChild(parentInstance, child) {
    debugger;
    // do append
  },

  finalizeInitialChildren(newElement, type, props, rootContainerInstance) {
    return false;
  },

  appendChild(parentInstance, child) {
    console.log('appendChild');
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
    // return TextElement
  },

  commitTextUpdate(textElement, oldText, newText) {
    debugger;
    // do commit
  },

  // create context to provide to children
  getRootHostContext(rootContainerInstance) {
    return new HIGContext(rootContainerInstance);
  },

  getChildHostContext(parentHostContext, type) {
    return parentHostContext.transition(type);
  },

  // turn off event handlers (in react-dom)
  prepareForCommit() {
    // no-op
  },

  commitMount(instance, type, newProps, internalInstanceHandle) {
    debugger;
    // ReactDOM uses this to focus any input elements it just created
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    hostContext
  ) {
    return true;
  },

  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle
  ) {
    instance._applyProps(instance, newProps, oldProps);
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
    // Create the top level HIGWeb object which can create all other objects
    // This is the context which knows how to construct everything else
    this._hig = new HIGWeb(this._higRef);

    // Pass the new HIGWeb instance to a custom fiber renderer container
    this._mountNode = HIGRenderer.createContainer(this._hig);

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

export class Slot extends Component {
  componentDidMount() {
    this._renderSlot();
  }

  _renderSlot() {
    const parentComponent = this;
    const children = this.props.children;
    const containerNode = this._higRef;

    unstable_renderSubtreeIntoContainer(
      parentComponent,
      children,
      containerNode
    );
  }

  componentDidUpdate(prevProps, prevState) {
    this._renderSlot();
  }

  componentWillUnmount() {
    unmountComponentAtNode(this._higRef);
  }

  render() {
    return (
      <hig-slot ref={ref => this._higRef = ref}>{this.props.children}</hig-slot>
    );
  }
}
