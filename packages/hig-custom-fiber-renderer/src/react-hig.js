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
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { createElement } from './react-hig-elements';
import prepareUpdate from './prepareUpdate';

export default function createComponent(type) {
  const Adapter = class extends React.Component {
    static HIG_COMPONENT = true;

    constructor(props) {
      super(props);
      this.instance = createElement(type, props);
    }

    componentDidMount() {
      this._el = ReactDOM.findDOMNode(this);
      this._mount = this._el.parentNode;

      this._anchor = document.createComment('anchor');

      if (!this._mount) {
        throw new Error('can only mount if there is a parentNode');
      }

      this._mount.replaceChild(this._anchor, this._el);

      if (!this.context.parent) {
        this.instance.mount(this._mount, this._anchor);
      } else {
        this.context.parent.appendChild(this.instance);
      }
    }

    // renderSlot(props) {
    //   if (type !== 'slot') {
    //     return;
    //   }

    //   const element = React.isValidElement(props.children)
    //     ? props.children
    //     : <div>{props.children}</div>;
    //   ReactDOM.unstable_renderSubtreeIntoContainer(
    //     this,
    //     element,
    //     this.instance.getSlotNode()
    //   );
    // }

    componentWillUnmount() {
      this._mount.replaceChild(this._el, this._anchor);
      this.instance.unmount();
    }

    componentWillReceiveProps(nextProps) {
      const updatePayload = prepareUpdate(this.props, nextProps);
      this.instance.commitUpdate(updatePayload, this.props, nextProps);
      // this.renderSlot(nextProps);
    }

    render() {
      React.Children.forEach(this.props.children, child => {
        if (child && child.type && !child.type.HIG_COMPONENT) {
          console.error(
            `HIG unapproved! ${type} can not render DOM elements directly. Tried to render ${child.type}.`
          );
        }
      });

      return <hig-component>{this.props.children}</hig-component>;
    }

    getChildContext() {
      return {
        parent: this.instance
      };
    }
  };

  Adapter.displayName = type;

  Adapter.contextTypes = {
    parent: PropTypes.shape({
      appendChild: PropTypes.func
    })
  };

  Adapter.childContextTypes = {
    parent: PropTypes.shape({
      appendChild: PropTypes.func
    })
  };

  return Adapter;
}

export const Button = createComponent('hig-button');
export const Menu = createComponent('hig-menu');
Menu.Top = createComponent('hig-menu-top');
Menu.Sidebar = createComponent('hig-sidebar');
Menu.Sidebar.Group = createComponent('hig-sidebar-group');
Menu.Sidebar.Item = createComponent('hig-sidebar-item');
