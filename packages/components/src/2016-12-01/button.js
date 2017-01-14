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

    this.state = ButtonState.getInitialState(this.defaults);

    applyProps(this, {
      display: 'inline-block',
      'border-radius': 2,
      background: 'white',
      color: 'black',
      'padding-horizontal': 3,
      'padding-vertical': 2,
      pointer: true,
    });

    this.addEventListener('mouseenter', () => {
      if (this.state.disabled) { return; }
      const nextState = ButtonState.enterHover(this.state);
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          type: 'mouseenter',
          state: nextState,
        },
      }));
    });

    this.addEventListener('mouseleave', () => {
      if (this.state.disabled) { return; }
      const nextState = ButtonState.leaveHover(this.state);
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
  }

  set background(val) {
    this.state.background = val || this.defaults.background;
    this._queueRender();
  }

  get background() {
    return this.state.background;
  }

  set color(val) {
    this.state.color = val || this.defaults.color;
    this._queueRender();
  }

  get color() {
    return this.state.color;
  }

  connectedCallback() {
    this.setAttribute('tabIndex', 0);
  }

  set disabled(val) {
    if (val) {
      this.state = ButtonState.enterDisabled(this.state);
    } else {
      this.state = ButtonState.leaveDisabled(this.state);
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

  set hover(val) {
    if (val) {
      this.state = ButtonState.enterHover(this.state);
    } else {
      this.state = ButtonState.leaveHover(this.state);
    }

    this._queueRender();
  }

  set skin(val) {
    switch (val) {
      case 'black':
        this._background = 'black';
        this._color = 'white';
        break;
      default:
        this._background = 'white';
        this._color = 'black';
        break;
    }
  }

  get hover() {
    return this.state.hover;
  }

  _render() {
    if (this.state.disabled) {
      this.background = 'grey';
      this.color = 'white';
    } else if (this.state.hover) {
      this.background = 'blue';
      this.color = 'white';
    } else {
      this.background = this._background;
      this.color = this._color;
    }

    switch (this.state.size) {
      case 'small':
        this.shadowEl.paddingHorizontal = 2;
        this.shadowEl.paddingVertical = 1;
        break;
      case 'large':
        this.shadowEl.paddingHorizontal = 4;
        this.shadowEl.paddingVertical = 3;
        break;
      default:
        this.shadowEl.paddingHorizontal = 3;
        this.shadowEl.paddingVertical = 2;
        break;
    }

    super._render();
  }
}

Registry.define('orion-button', Button);

module.exports = Button;
