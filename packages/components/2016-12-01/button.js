require('./inline');

const Registry = require('../utils/private-registry');

class Button extends HTMLElement {
  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.innerHTML = `
      <orion-inline
        border-radius="2"
        background="black"
        color="white"
        padding-horizontal="3"
        padding-vertical="2"
        dim
        pointer><slot /></orion-inline>
    `;
  }

  connectedCallback() {
    // Do we update with slot here?
  }

  disconnectedCallback() {

  }

  attributeChangedCallback() {

  }
}

Registry.define('orion-button', Button);

module.exports = Button;
