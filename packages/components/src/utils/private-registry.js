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
