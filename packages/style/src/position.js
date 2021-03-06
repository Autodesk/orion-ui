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

const concat = (acc, memo) => acc + memo;

function buildPositions() {
  const dimensions = ['top', 'right', 'bottom', 'left'];

  return dimensions
    .map(dimension => {
      return scale
        .map((scaleValue, scaleIndex) => {
          return `.pos-${dimension}-${scaleIndex} { ${dimension}: ${scaleValue} } `;
        })
        .reduce(concat);
    })
    .reduce(concat);
}

const css = `
  .pos-st {
    position: static;
  }

  .pos-rel {
    position: relative;
  }

  .pos-abs {
    position: absolute;
  }

  .pos-cov {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  ${buildPositions()}
`;

const attributes = ['position', 'top', 'right', 'bottom', 'left'];

function attributeChangedCallback(attrName, value) {
  // Absolute positioning dimensions
  if (['top', 'right', 'bottom', 'left'].includes(attrName)) {
    return `pos-${attrName}-${value}`;
  }

  // Positioning
  switch (value) {
    case 'absolute':
      return 'pos-abs';
    case 'relative':
      return 'pos-rel';
    case 'static':
      return 'pos-sta';
    case 'cover':
      return 'pos-cov';
    default:
      throw new Error('unknown style');
  }
}

module.exports = {
  css,
  attributes,
  attributeChangedCallback
};
