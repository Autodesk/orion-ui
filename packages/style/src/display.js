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
  .dis-blk {
    display: block;
  }

  .dis-flx {
    display: flex;
  }

  .dis-inl {
    display: inline;
  }

  .dis-inb {
    display: inline-block;
  }
`;

const attributes = [
  'display',
];

function attributeChangedCallback(attrName, value) {
  switch (value) {
    case 'block':
      return 'dis-blk';
    case 'flex':
      return 'dis-flx';
    case 'inline':
      return 'dis-inl';
    case 'inline-block':
      return 'dis-inb';
    default:
      throw new Error('unknown style');
  }
}

module.exports = {
  css,
  attributes,
  attributeChangedCallback,
};
