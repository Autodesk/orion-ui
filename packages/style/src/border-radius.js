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
  .br0 { border-radius: 0;}
  .br2 { border-radius: 0.25rem;}
  .br-pill { border-radius: 9999px; }
`;

const attributes = ['border-radius'];

const scale = {
  0: 'br0',
  2: 'br2',
  pill: 'br-pill'
};

function attributeChangedCallback(attrName, value) {
  return scale[value];
}

module.exports = {
  css,
  attributes,
  attributeChangedCallback
};
