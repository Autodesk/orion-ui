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
const scale = require('./scale');

const selectors = {
  pa: ['padding'],
  pl: ['padding-left'],
  pr: ['padding-right'],
  pb: ['padding-bottom'],
  pt: ['padding-top'],
  pv: ['padding-top', 'padding-bottom'],
  ph: ['padding-left', 'padding-right'],
  ma: ['margin'],
  ml: ['margin-left'],
  mr: ['margin-right'],
  mb: ['margin-bottom'],
  mt: ['margin-top'],
  mv: ['margin-top', 'margin-bottom'],
  mh: ['margin-left', 'margin-right']
};

const concat = (acc, memo) => acc + memo;

function buildSelectors() {
  return Object.keys(selectors)
    .map(selectorPrefix => {
      const cssProperties = selectors[selectorPrefix];

      return scale
        .map((scaleValue, scaleIndex) => {
          return `
        .${selectorPrefix}${scaleIndex} {
          ${cssProperties
            .map(cssProperty => {
              return `
              ${cssProperty}: ${scaleValue};
            `;
            })
            .reduce(concat)}
        }`;
        })
        .reduce(concat);
    })
    .reduce(concat);
}

const css = `
  ${buildSelectors()}
`;

const attributes = [
  'padding-horizontal',
  'padding-vertical',
  'padding-bottom',
  'padding-left'
];

function attributeChangedCallback(attrName, value) {
  switch (attrName) {
    case 'padding-horizontal':
      return `ph${value}`;
    case 'padding-vertical':
      return `pv${value}`;
    case 'padding-bottom':
      return `pb${value}`;
    case 'padding-left':
      return `pl${value}`;
    default:
      throw new Error('unknown style');
  }
}

module.exports = {
  attributes,
  attributeChangedCallback,
  css
};
