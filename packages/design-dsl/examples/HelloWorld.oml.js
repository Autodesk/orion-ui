import IntlMessageFormat from 'intl-messageformat';

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
    this._fragment.update(newProps, this._props);
  }

  teardown() {
    this._fragment.teardown();
    this._fragment = null;
    this._props = {};
  }
}

function render(props) {
  const text1 = document.createElement('span');

  text1.classList = 'size-3';

  // create message
  const text1ContentMessage = new IntlMessageFormat("Hello, {name}", "en-US");

  // create text2 node
  const text1Content = document.createTextNode();

  // Update text2
  text1Content.data = text1ContentMessage.format(props)

  // mount text2
  text1.appendChild(text1Content);

  return {
    mount: target => {
      // mount text
      target.appendChild(text1);
    },

    update: (changed, props) => {
      // Update text2
      text1Content.data = text1ContentMessage.format(props);
    },

    teardown: () => {
      // unmount text
      text1.parentNode.removeChild(text1);
    }
  }
}