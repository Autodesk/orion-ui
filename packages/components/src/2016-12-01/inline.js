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
const Registry = require('../utils/private-registry.js');
const { BorderRadius, Hovers, Skins, Spacing } = require('@orion-ui/style/lib/2016-12-01');

const styles = [BorderRadius, Hovers, Skins, Spacing];


class Inline extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = '<span><slot /></span>';

    styles.forEach((style) => {
      const element = document.createElement('style');
      element.textContent = style.css;
      shadowRoot.appendChild(element);
    });

    this.state = {};

    this._updateClassName();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // Guard no change
    if (oldVal === newVal) {
      return;
    }

    this.state[attrName] = newVal;

    this._updateClassName();
  }

  set background(newValue) {
    this.state.background = newValue;
    this._updateClassName();
  }

  set color(newValue) {
    this.state.color = newValue;
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
    this.shadowRoot.querySelector('span').className = className;
  }
}

Inline.observedAttributes = styles
                              .map(style => style.attributes)
                              .reduce((acc, memo) => acc.concat(memo));

Registry.define('orion-inline', Inline);

module.exports = Inline;
