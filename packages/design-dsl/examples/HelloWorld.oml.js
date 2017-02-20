import IntlMessageFormat from "intl-messageformat";

function render(props) {
  const text = document.createElement("span");

  text.classList = "font-size-s";

  // create message
  const textContentMessage = new IntlMessageFormat("Hello, {name}", "en-US");

  // create text node
  const textContent = document.createTextNode(textContentMessage.format(props));

  // mount text node
  text.appendChild(textContent);

  return {
    mount: (target, anchor) => {
      // mount text
      target.insertBefore(text, anchor);
    },
    update: (changed, props) => {
      // update content
      textContent.data = textContentMessage.format(props);
    },
    teardown: () => {
      // unmount text
      text.parentNode.removeChild(text);
    }
  };
}

export default class HelloWorld {
  constructor(options) {
    const { mount, anchor, props } = options;
    this._props = props;
    this._fragment = render(this._props, this);
    this._fragment.mount(mount, anchor);
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
