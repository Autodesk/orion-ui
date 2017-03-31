import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default function higify({ displayName, childContext, parentContext, createContext, mountContext, create, update }) {
  const Adapter = class extends React.Component {
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
      ReactDOM.unmountComponentAtNode(this._el);

      this._anchor = document.createComment('anchor');

      if (!this._mount) {
        throw new Error('can only mount if there is a parentNode');
      }

      this._mount.replaceChild(this._anchor, this._el);

      if (mountContext) {
        mountContext(this.instance, this._mount, this._anchor);
      }
    }

    componentWillUnmount() {
      this._mount.replaceChild(this._el, this._anchor);
      this.instance.teardown();
    }

    componentWillReceiveProps(nextProps, nextContext) {
      update(this.instance, nextProps);
    }

    render() {
      return <hig-component>{this.props.children}</hig-component>;
    }

    getChildContext() {
      return {
        [displayName]: true,
        parent: this.instance
      };
    }
  }

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