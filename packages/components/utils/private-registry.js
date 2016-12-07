const registry = new Map();

module.exports = {
  /**
   * Registers a customElement
   *
   * Throws an error if the tagName is registered with a different constructorFn
   */
  define: (tagName, constructorFn) => {
    if (registry.get(tagName)) {
      if (registry.get(tagName) !== constructorFn) {
        throw new Error(`${tagName} already registered to a different constructor function`);
      }
    } else {
      if (!window.customElements) { return; }
      window.customElements.define(tagName, constructorFn);
    }
  },
};
