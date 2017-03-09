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
const css = `
  .ovy-h {
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .ovy-s {
    overflow-y: scroll;
    overflow-x: hidden
  }
`;


const attrMap = {
  'overflow-y': {
    scroll: 'ovy-s',
    hidden: 'ovy-h',
  },
};

const attributes = Object.keys(attrMap);

function attributeChangedCallback(attrName, value) {
  const styleClass = attrMap[attrName][value];
  if (typeof styleClass === 'undefined') {
    throw new Error(`Unknown style for ${attrName}="${value}"`);
  }
  return styleClass;
}

module.exports = {
  css,
  attributes,
  attributeChangedCallback,
};
