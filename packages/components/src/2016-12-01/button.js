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
require('../../vendor/es5-custom-element-shim.js');
const Element = require('./element');
const ButtonState = require('./button-state.js');

const Registry = require('../utils/private-registry.js');
const applyProps = require('../utils/apply-props.js');

class Button extends Element {
  constructor() {
    super();

    this.defaults = {
      background: 'black',
      color: 'white',
    };

    this.state = ButtonState.getInitialState();

    applyProps(this, {
      display: 'inline-block',
      'border-radius': 2,
      'padding-horizontal': 3,
      'padding-vertical': 2,
      'reset-focus-style': true,
      userSelect: false,
      ...this.defaults,
    });

    ['_focus', '_blur'].forEach((fn) => {
      this[fn] = this[fn].bind(this);
    });
  }

  connectedCallback() {
    this._addListeners();
  }

  disconnectedCallback() {
    this.removeEventListener('focus', this._focus);
    this.removeEventListener('blur', this._blur);
  }

  _addListeners() {
    this.addEventListener('mouseenter', () => {
      if (this.state.disabled) { return; }
      let nextState = ButtonState.enterHover(this.state);
      nextState = { hover: nextState.hover, disabled: nextState.disabled };
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          type: 'mouseenter',
          state: nextState,
        },
      }));
    });

    this.addEventListener('mouseleave', () => {
      if (this.state.disabled) { return; }
      let nextState = ButtonState.leaveHover(this.state);
      nextState = { hover: nextState.hover, disabled: nextState.disabled };
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          type: 'mouseleave',
          state: nextState,
        },
      }));
    });

    this.addEventListener('click', (event) => {
      if (this.state.disabled) {
        event.stopImmediatePropagation();
      }
    });

    this.addEventListener('focus', this._focus);
    this.addEventListener('blur', this._blur);
  }

  set background(val = this.defaults.background) {
    this.state.background = val;
    this._queueRender();
  }

  get background() {
    return this.state.background;
  }

  set color(val = this.defaults.color) {
    this.state.color = val;
    this._queueRender();
  }

  get color() {
    return this.state.color;
  }

  set disabled(val) {
    if (val) {
      applyProps(this.state, ButtonState.enterDisabled(this.state));
    } else {
      applyProps(this.state, ButtonState.leaveDisabled(this.state));
    }

    this._queueRender();
  }

  get disabled() {
    return this.state.disabled;
  }

  set size(val) {
    this.state.size = val;
    this._queueRender();
  }

  get size() {
    return this.state.size;
  }

  set hasFocus(val) {
    this.state.hasFocus = val;
    this._queueRender();
  }

  get hasFocus() {
    return this.state.hasFocus;
  }

  set hover(val) {
    if (val) {
      applyProps(this.state, ButtonState.enterHover(this.state));
    } else {
      applyProps(this.state, ButtonState.leaveHover(this.state));
    }

    this._queueRender();
  }

  get hover() {
    return this.state.hover;
  }

  _focus() {
    const nextState = ButtonState.focus(this.state);
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: 'focus',
        state: nextState,
      },
    }));
  }

  _blur() {
    const nextState = ButtonState.blur(this.state);
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: 'blur',
        state: nextState,
      },
    }));
  }

  render() {
    if (this.state.disabled) {
      this.viewState.background = 'grey1';
      this.viewState.color = 'white';
    } else if (this.state.hover || this.state.hasFocus) {
      this.viewState.background = 'blue';
      this.viewState.color = 'white';
    } else {
      this.viewState.background = this.state.background;
      this.viewState.color = this.state.color;
    }

    if (this.state.disabled) {
      this.removeAttribute('tabIndex');
      this.pointer = false;
      this.pointerEvents = 'none';
    } else {
      this.setAttribute('tabIndex', 0);
      this.pointer = true;
      this.pointerEvents = 'initial';
    }

    switch (this.state.size) {
      case 'small':
        this.viewState['padding-horizontal'] = 2;
        this.viewState['padding-vertical'] = 1;
        break;
      case 'large':
        this.viewState['padding-horizontal'] = 4;
        this.viewState['padding-vertical'] = 3;
        break;
      default:
        this.viewState['padding-horizontal'] = 3;
        this.viewState['padding-vertical'] = 2;
        break;
    }

    super.render();
  }
}

Registry.define('orion-button', Button);

module.exports = Button;
