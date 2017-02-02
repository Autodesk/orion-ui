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
require('../../vendor/object-entries-shim.js');
require('../utils/inject-styles.js');
const Registry = require('../utils/private-registry.js');
const { BorderRadius, BoxShadow, Container, Display, Hovers, Position, ResetFocusStyle, Skins, Spacing } = require('@orion-ui/style/lib/2016-12-01');

const nativeStyles = ['top', 'left', 'width'];
const styles = [
  BorderRadius,
  BoxShadow,
  Container,
  Display,
  Hovers,
  Position,
  ResetFocusStyle,
  Skins,
  Spacing,
];

class Element extends HTMLElement {
  constructor() {
    super();
    this.state = {};
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // Guard no change
    if (oldVal === newVal) {
      return;
    }

    this.state[attrName] = newVal;

    this._queueRender();
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
    this._updateClassName();
  }

  _updateClassName() {
    // Send each attribute to the style modules and concatenate a new class and apply it
    let className = '';

    function appendClassName(style, name, value) {
      // Guard style does not handle attribute
      if (style.attributes.indexOf(name) === -1) {
        return;
      }

      const additionalClass = style.attributeChangedCallback(name, value);
      if (additionalClass) {
        className += ` ${additionalClass}`;
      }
    }

    Object.entries(this.state).forEach(([name, value]) => {
      styles.forEach(style => appendClassName(style, name, value));
    });

    // Update the class name
    this.className = className;
  }
}

Element.observedAttributes = styles
                              .map(style => style.attributes)
                              .reduce((acc, memo) => acc.concat(memo));

Element.observedAttributes.concat(nativeStyles).forEach((attr) => {
  Object.defineProperty(Element.prototype, attr, {
    get() {
      return this.state[attr];
    },
    set(newValue) {
      if (this.state[attr] === newValue) { return; }

      this.state[attr] = newValue;
      this._queueRender();
    },
  });
});

Registry.define('orion-element', Element);

module.exports = Element;
