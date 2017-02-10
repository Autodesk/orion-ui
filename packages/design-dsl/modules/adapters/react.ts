import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export interface OrionComponentOptions {
  mount: Node | Comment;
  anchor: Node | Comment;
  props: any;
}

export interface OrionComponent {
  get(): any;
  set(props: any): void
  teardown(): void;
}

export interface OrionComponentStatic {
  new (options: OrionComponentOptions): OrionComponent;
}

export default function adapt(InnerComponent: OrionComponentStatic): any {
  return class Adapter extends Component<any, void> {
    private anchor: Comment;
    private instance: OrionComponent;

    componentDidMount() {
      const el = ReactDOM.findDOMNode(this);

      const mount = el.parentNode;

      ReactDOM.unmountComponentAtNode(el);

      this.anchor = document.createComment('anchor');

      if (!mount) {
        throw new Error('can only mount if there is a parentNode');
      }

      mount.replaceChild(this.anchor, el);

      this.instance = new InnerComponent({
        mount,
        anchor: this.anchor,
        props: this.getProps()
      });

      if (this.anchor.parentNode) {
        this.anchor.parentNode.removeChild(this.anchor);
      }
    }

    componentWillUnmount() {
      this.instance.teardown();
    }

    getProps(props = this.props) {
      const { children, ...rest } = props;

      return rest;
    }

    componentWillReceiveProps(nextProps: any) {
      this.instance.set(this.getProps(nextProps));
    }

    shouldComponentUpdate() {
      return false;
    }

    render() {
      return React.createElement('span');
    }
  }
}