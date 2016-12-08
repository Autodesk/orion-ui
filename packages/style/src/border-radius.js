const css = `
  .br2 { border-radius: 0.25rem;}
  .br-pill { border-radius: 9999px; }
`;

const attributes = [
  'border-radius',
];


const scale = {
  2: 'br2',
  pill: 'br-pill',
};

function attributeChangedCallback(attrName, value) {
  return scale[value];
}

module.exports = {
  css,
  attributes,
  attributeChangedCallback,
};
