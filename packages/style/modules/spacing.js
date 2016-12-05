
const scale = [
  0, '.25rem', '.5rem', '1rem',
  '2rem', '4rem', '8rem', '16rem'
];

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
  return Object.keys(selectors).map(selectorPrefix => {
    const cssProperties = selectors[selectorPrefix];

    return scale.map((scaleValue, scaleIndex) => {
      return `
        .${selectorPrefix}${scaleIndex} {
          ${cssProperties.map(cssProperty => {
            return `
              ${cssProperty}: ${scaleValue};
            `;
          }).reduce(concat)}
        }`;
    }).reduce(concat);
  }).reduce(concat);
}

const css = `
  ${buildSelectors()}
`;

const attributes = [
  'padding-horizontal',
  'padding-vertical'
];

function attributeChangedCallback(attrName, value) {
  switch (attrName) {
    case 'padding-horizontal':
      return `ph${value}`;
    case 'padding-vertical':
      return `pv${value}`;
    default:
      throw new Error('unknown style');
  }
}

module.exports = {
  attributes,
  attributeChangedCallback,
  css
};