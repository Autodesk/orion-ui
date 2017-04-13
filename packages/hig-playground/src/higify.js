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

export default function higify(
  {
    displayName,
    childContext,
    parentContext,
    createContext,
    type,
    mountContext,
    create,
    update
  }
) {
  const Adapter = class extends React.Component {
    static HIG_COMPONENT = true;

    constructor(props, context) {
      super(props);

      if (createContext) {
        this.instance = createContext();
      } else {
        this.instance = create(props, context);
      }
    }

    componentDidMount() {
      this._el = ReactDOM.findDOMNode(this);
      this._mount = this._el.parentNode;

      this._anchor = document.createComment('anchor');

      if (!this._mount) {
        throw new Error('can only mount if there is a parentNode');
      }

      this._mount.replaceChild(this._anchor, this._el);

      if (mountContext) {
        mountContext(this.instance, this._mount, this._anchor);
      }

      this.renderSlot();
    }

    renderSlot() {
      if (type !== 'slot') {
        return;
      }

      const element = React.isValidElement(this.props.children)
        ? this.props.children
        : <div>{this.props.children}</div>;
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        element,
        this.instance.getSlotNode()
      );
    }

    componentWillUnmount() {
      this._mount.replaceChild(this._el, this._anchor);

      if (this.instance) {
        this.instance.teardown();
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      this.renderSlot();

      if (update && this.instance) {
        update(this.instance, nextProps);
      }
    }

    render() {
      React.Children.forEach(this.props.children, child => {
        if (child.type && !child.type.HIG_COMPONENT && type !== 'slot') {
          console.error(
            `HIG unapproved! ${displayName} can not render DOM elements directly. Tried to render ${child.type}.`
          );
        }
      });

      return <hig-component>{this.props.children}</hig-component>;
    }

    getChildContext() {
      return {
        [displayName]: true,
        parent: this.instance
      };
    }
  };

  Adapter.displayName = displayName;

  if (parentContext) {
    Adapter.contextTypes = {
      [parentContext.type]: PropTypes.bool,
      parent: parentContext.shape
    };
  }

  Adapter.childContextTypes = {
    [displayName]: PropTypes.bool.isRequired,
    parent: childContext || PropTypes.any
  };

  return Adapter;
}
