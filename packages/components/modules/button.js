const {BorderRadius, Skins, Spacing, Hovers} = require('@orion-ui/style/2016-12-01');

class Button extends HTMLElement {
  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.innerHTML = `
      <style>${BorderRadius.css}</style>
      <style>${Spacing.css}</style>
      <style>${Skins.css}</style>
      <style>${Hovers.css}</style>
      <a class="br2 bg-black white ph3 pv2 dim pointer">Hello Web Components</a>
    `;
  }

  connectedCallback() {
    // Do we update with slot here?
  }

  disconnectedCallback() {
    console.log(`Disconnected`);
  }

  attributeChangedCallback(attrName, oldVal, newVal)	{

  }
}

module.exports = Button;