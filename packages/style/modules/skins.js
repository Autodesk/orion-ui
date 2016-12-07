
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
  white: '#fff'
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
  'background', 'color'
];

function attributeChangedCallback(attrName, value) {
  if (attrName === 'background') {
    return `bg-${value}`;
  } else if (attrName === 'color') {
    return value;
  }
}

module.exports = {
  attributes,
  attributeChangedCallback,
  colors,
  css
};
