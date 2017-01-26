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

/**
 * This file is inspired by https://github.com/webcomponents/react-integration/blob/master/src/index.js
 */

/**
 * Create an event listener for an element, remove an old one if it exists
 */
function syncEvent(el, eventName, newEventHandler) {
  const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
  const eventStore = el.$$events || (el.$$events = {});
  const oldEventHandler = eventStore[eventNameLc];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    el.removeEventListener(eventNameLc, oldEventHandler);
  }

  // Bind new listener.
  if (newEventHandler) {
    el.addEventListener(eventNameLc, eventStore[eventNameLc] = function handler(e) {
      newEventHandler.call(this, e);
    });
  }
}

/**
 * Intelligently apply React Component properties to a HTML Custom Element.
 * - props.children is ignored
 * - any property with the format: onSomething will get registered as an event.
 *
 * @example:
 *
 * applyProps(el, { disabled: true, onChange: myFunction })
 *
 * Translates to:
 *
 * el.disabled = true;
 *
 * el.addEventListener('change', myFunction)
 */
function applyProps(el, props) {
  Object.keys(props).forEach((name) => {
    if (name === 'children') {
      return;
    }

    if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
      syncEvent(el, name.substring(2), props[name]);
    } else {
      el[name] = props[name];
    }
  });
}

module.exports = applyProps;
