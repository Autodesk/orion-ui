"use strict";

/**
* @license
* Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
* This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
* The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
* The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
* Code distributed by Google as part of the polymer project is also
* subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
* This shim allows elements written in, or compiled to, ES5 to work on native
* implementations of Custom Elements.
*
* ES5-style classes don't work with native Custom Elements because the
* HTMLElement constructor uses the value of `new.target` to look up the custom
* element definition for the currently called constructor. `new.target` is only
* set when `new` is called and is only propagated via super() calls. super()
* is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works
* when extending other ES5-style classes, and does not propagate `new.target`.
*
* This shim allows the native HTMLElement constructor to work by generating and
* registering a stand-in class instead of the users custom element class. This
* stand-in class's constructor has an actual call to super().
* `customElements.define()` and `customElements.get()` are both overridden to
* hide this stand-in class from users.
*
* In order to create instance of the user-defined class, rather than the stand
* in, the stand-in's constructor swizzles its instances prototype and invokes
* the user-defined constructor. When the user-defined constructor is called
* directly it creates an instance of the stand-in class to get a real extension
* of HTMLElement and returns that.
*
* There are two important constructors: A patched HTMLElement constructor, and
* the StandInElement constructor. They both will be called to create an element
* but which is called first depends on whether the browser creates the element
* or the user-defined constructor is called directly. The variables
* `browserConstruction` and `userConstruction` control the flow between the
* two constructors.
*
* This shim should be better than forcing the polyfill because:
*   1. It's smaller
*   2. All reaction timings are the same as native (mostly synchronous)
*   3. All reaction triggering DOM operations are automatically supported
*
* There are some restrictions and requirements on ES5 constructors:
*   1. All constructors in a inheritance hierarchy must be ES5-style, so that
*      they can be called with Function.call(). This effectively means that the
*      whole application must be compiled to ES5.
*   2. Constructors must return the value of the emulated super() call. Like
*      `return SuperClass.call(this)`
*   3. The `this` reference should not be used before the emulated super() call
*      just like `this` is illegal to use before super() in ES6.
*   4. Constructors should not create other custom elements before the emulated
*      super() call. This is the same restriction as with native custom
*      elements.
*
*  Compiling valid class-based custom elements to ES5 will satisfy these
*  requirements with the latest version of popular transpilers.
*/

var code = "(() => {\n  'use strict';\n\n  if (!window.customElements) {\n    console.warn('Custom elements are not available');\n    return;\n  }\n\n  const NativeHTMLElement = window.HTMLElement;\n  const nativeDefine = window.customElements.define;\n  const nativeGet = window.customElements.get;\n  /**\n  * Map of user-provided constructors to tag names.\n  *\n  * @type {Map<Function, string>}\n  */\n  const tagnameByConstructor = new Map();\n  /**\n  * Map of tag names to user-provided constructors.\n  *\n  * @type {Map<string, Function>}\n  */\n  const constructorByTagname = new Map();\n  /**\n  * Whether the constructors are being called by a browser process, ie parsing\n  * or createElement.\n  */\n  let browserConstruction = false;\n  /**\n  * Whether the constructors are being called by a user-space process, ie\n  * calling an element constructor.\n  */\n  let userConstruction = false;\n  window.HTMLElement = function() {\n   if (!browserConstruction) {\n     const tagname = tagnameByConstructor.get(this.constructor);\n     const fakeClass = nativeGet.call(window.customElements, tagname);\n     // Make sure that the fake constructor doesn't call back to this constructor\n     userConstruction = true;\n     const instance = new (fakeClass)();\n     return instance;\n   }\n   // Else do nothing. This will be reached by ES5-style classes doing\n   // HTMLElement.call() during initialization\n   browserConstruction = false;\n  };\n  // By setting the patched HTMLElement's prototype property to the native\n  // HTMLElement's prototype we make sure that:\n  //     document.createElement('a') instanceof HTMLElement\n  // works because instanceof uses HTMLElement.prototype, which is on the\n  // ptototype chain of built-in elements.\n  window.HTMLElement.prototype = NativeHTMLElement.prototype;\n  window.customElements.define = (tagname, elementClass) => {\n   const elementProto = elementClass.prototype;\n   const StandInElement = class extends NativeHTMLElement {\n     constructor() {\n       // Call the native HTMLElement constructor, this gives us the\n       // under-construction instance as 'this':\n       super();\n       // The prototype will be wrong up because the browser used our fake\n       // class, so fix it:\n       Object.setPrototypeOf(this, elementProto);\n       if (!userConstruction) {\n         // Make sure that user-defined constructor bottom's out to a do-nothing\n         // HTMLElement() call\n         browserConstruction = true;\n         // Call the user-defined constructor on our instance:\n         elementClass.call(this);\n       }\n       userConstruction = false;\n     }\n   };\n   const standInProto = StandInElement.prototype;\n   StandInElement.observedAttributes = elementClass.observedAttributes;\n   standInProto.connectedCallback = elementProto.connectedCallback;\n   standInProto.disconnectedCallback = elementProto.disconnectedCallback;\n   standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;\n   standInProto.adoptedCallback = elementProto.adoptedCallback;\n   tagnameByConstructor.set(elementClass, tagname);\n   constructorByTagname.set(tagname, elementClass);\n   nativeDefine.call(window.customElements, tagname, StandInElement);\n  };\n  window.customElements.get = (tagname) => constructorByTagname.get(tagname);\n})();";

eval(code);
