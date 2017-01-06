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
 * Given a dictionary and a template function build a string
 */
function template(dictionary, templateFn) {
  return Object.keys(dictionary)
    .map(item => templateFn(item))
    .reduce((acc, memo) => acc + memo);
}

/**
 * Each color listed here will have a .bg-${color} and .${color} class generated
 */
const colors = {
  black: '#000',
  white: '#fff',
  blue: '#00f',
  grey: '#ddd',
};

/**
 * Creates a collection of CSS classes setting colors
 */
function buildColors() {
  return template(colors, color => `.${color} { color: ${colors[color]}}`);
}

/**
 * Creates a collection of CSS classes setting background colors
 */
function buildBackgrounds() {
  return template(colors, color => `.bg-${color} { background-color: ${colors[color]}}`);
}

const css = `
  ${buildColors()}
  ${buildBackgrounds()}
`;

const attributes = [
  'background', 'color',
];

function attributeChangedCallback(attrName, value) {
  if (attrName === 'background') {
    return `bg-${value}`;
  } else if (attrName === 'color') {
    return value;
  }
  return null;
}

module.exports = {
  attributes,
  attributeChangedCallback,
  colors,
  css,
};
