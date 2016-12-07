require('./inline');

const Registry = require('../utils/private-registry.js');

class Button extends window.HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
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
}

Registry.define('orion-button', Button);

module.exports = Button;
