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
require('./inline');
const ButtonState = require('./button-state.js');

const Registry = require('../utils/private-registry.js');

class Button extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <orion-inline
        border-radius="2"
        background="white"
        color="black"
        padding-horizontal="3"
        padding-vertical="2"
        pointer><slot /></orion-inline>
    `;
    this.shadowEl = shadowRoot.children[0];

    this.state = ButtonState.getInitialState();

    // render initial state
    this._queueRender();

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
    this.state.background = val;
    this._queueRender();
  }

  get background() {
    return this.state.background;
  }

  set color(val) {
    this.state.color = val;
    this._queueRender();
  }

  get color() {
    return this.state.color;
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

  get hover() {
    return this.state.hover;
  }

  _queueRender() {
    if (this._renderQueued) {
      return;
    }

    this._renderQueued = true;
    requestAnimationFrame(() => {
      this._renderQueued = false;
      this._render();
    });
  }

  _render() {
    if (this.state.disabled) {
      this.shadowEl.background = 'grey';
      this.shadowEl.color = 'white';
    } else if (this.state.hover) {
      this.shadowEl.background = 'blue';
      this.shadowEl.color = 'white';
    } else {
      this.shadowEl.background = this.background;
      this.shadowEl.color = this.color;
    }

    switch (state.size) {
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
  }
}

Registry.define('orion-button', Button);

module.exports = Button;
