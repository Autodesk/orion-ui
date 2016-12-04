const css = `
  .dim {
    opacity: 1;
    transition: opacity .15s ease-in;
  }
  .dim:hover,
  .dim:focus {
    opacity: .5;
    transition: opacity .15s ease-in;
  }
  .dim:active {
    opacity: .8; transition: opacity .15s ease-out;
  }

  .pointer:hover {
    cursor: pointer;
  }
`;

module.exports = {
  css
}