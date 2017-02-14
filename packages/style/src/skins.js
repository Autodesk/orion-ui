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
 * Each color listed here will have a .bg-${color}, .bdr-${color} and .${color} class generated
 */
const colors = {
  black: '#000',
  white: '#fff',
  blue: '#00f',
  grey4: '#999', // 160-ish
  grey3: '#aaa', // 170-ish
  grey2: '#ccc', // 200-ish
  grey1: '#ddd', // 220-ish
  grey0: '#eee', // 240-ish
};

/**
 * Creates a collection of CSS classes setting colors
 */
function buildColors() {
  return template(colors, color => `.${color} { color: ${colors[color]} } `);
}

/**
 * Creates a collection of CSS classes setting background colors
 */
function buildBackgrounds() {
  return template(colors, color => `.bg-${color} { background-color: ${colors[color]} } `);
}

/**
 * Creates a collection of CSS classes setting border widths
 */
function buildBorderWidths() {
  const fullBorderCSS = '.bdr-1 { border-width: 1px; border-style: solid } ';
  const sides = ['top', 'right', 'bottom', 'left'];
  const sidesCSS = sides
    .map(borderSide => `.bdr-${borderSide}-1 { border-${borderSide}-width: 1px; border-${borderSide}-style: solid } `)
    .reduce((acc, memo) => acc + memo);
  return fullBorderCSS + sidesCSS;
}

/**
 * Creates a collection of CSS classes setting border colors
 */
function buildBorderColors() {
  return template(colors, color => `.bdr-${color} { border-color: ${colors[color]} } `);
}

const css = `
  ${buildColors()}
  ${buildBackgrounds()}
  ${buildBorderWidths()}
  ${buildBorderColors()}
`;

const attributes = [
  'background', 'color', 'border-color', 'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
];

function attributeChangedCallback(attrName, value) {
  if (attrName === 'background') {
    return `bg-${value}`;
  } else if (attrName === 'color') {
    return value;
  } else if (attrName === 'border-color') {
    return `bdr-${value}`;
  } else if (attrName === 'border') {
    return `bdr-${value}`;
  } else if (attrName.indexOf('border-') === 0) {
    return `bdr-${attrName.slice(7)}-${value}`;
  }
  return null;
}

module.exports = {
  attributes,
  attributeChangedCallback,
  colors,
  css,
};
