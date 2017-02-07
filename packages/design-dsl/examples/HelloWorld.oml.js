import IntlMessageFormat from 'intl-messageformat';

function render(root, component) {
  const text = document.createElement('span');
  text.classList = 'size-3';

  const textMessage = new IntlMessageFormat("Hello, {name}", "en-US");
  const text2 = document.createTextNode(textMessage.format(root));
  text.appendChild(text2);

  return {
    mount: target => {
      target.appendChild(text);
    },

    update: (changed, root) => {
      text2.data = textMessage.format(root);
    },

    teardown: () => {
      text.parentNode.removeChild(text);
    }
  }
}

export default class HelloWorld {
  constructor(mount, props) {
    this._props = props;
    this._fragment = render(this._props, this);
    this._fragment.mount(mount);
  }

  get(key) {
    return key ? this._props[key] : this._props;
  }

  set(newProps) {
    const oldProps = this._props;
    this._props = Object.assign({}, oldProps, newProps);
    this._fragment.update( newProps, this._props );
  }

  teardown() {
    this._fragment.teardown();
    this._fragment = null;
    this._props = {};
  }
}