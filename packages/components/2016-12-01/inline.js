const {BorderRadius, Hovers, Skins, Spacing} = require('@orion-ui/style/2016-12-01');
const styles = [BorderRadius, Hovers, Skins, Spacing];

const Registry = require('../utils/private-registry.js');

class Inline extends HTMLElement {
  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = '<span><slot /></span>';

    styles.forEach(style => {
      const element = document.createElement('style');
      element.textContent = style.css;
      shadowRoot.appendChild(element);
    });

    this._updateClassName();

  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // Guard no change
    if (oldVal === newVal) {
      return;
    }

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

    for (let i = 0; i < this.attributes.length; i++) {
      const {name, value} = this.attributes[i];
      styles.forEach(style => appendClassName(style, name, value));
    }

    // Update the class name
    this.shadowRoot.querySelector('span').className = className;
  }
}

Inline.observedAttributes = styles.map(style => style.attributes).reduce((acc, memo) => acc.concat(memo));

Registry.define('orion-inline', Inline);

module.exports = Inline;
