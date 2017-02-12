require('shelljs/global');

const path = require('path');
const { expect } = require('chai');

const compiler = `./node_modules/.bin/nearleyc`;

const grammarSource = path.join(__dirname, 'oml.ne');
const grammarDest = path.join(__dirname, 'oml.js');

const {code, stderr} = exec(`${compiler} ${grammarSource} -o ${grammarDest}`, { silent: true });

if (stderr) {
  throw new Error(stderr);
  process.exit(1);
}

var grammar = require("./oml.js");
var nearley = require("nearley");

describe('valid open and close tag with whitespace', () => {
  let ast;

  beforeEach(() => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed(`
      <orion>
      </orion>
    `)

    ast = p.results[0];
  });

  it('sets type to tag', () => {
    expect(ast.type).to.equal('tag');
  });

  it('sets name to the tag name', () => {
    expect(ast.name).to.equal('orion');
  });

  it('sets attribs to empty object', () => {
     expect(ast.attribs).to.eql({});
  });

  it('sets children to empty array', () => {
    expect(ast.children).to.eql([]);
  });

  it('sets startIndex', () => {
    expect(ast.startIndex).to.eql(7);
  });
});

describe('boolean attribute', () => {
  it('sets a boolean attribute to true', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed("<orion enabled></orion>");

    const ast = p.results[0];
    expect(ast.attribs.enabled).to.equal(true);
  });

  it('works when the boolean has a space', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed("<orion enabled ></orion>");

    const ast = p.results[0];
    expect(ast.attribs.enabled).to.equal(true);
  });

  it('handles multiple booleans', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed("<orion enabled disabled></orion>");

    const ast = p.results[0];
    expect(ast.attribs.enabled).to.equal(true);
    expect(ast.attribs.disabled).to.equal(true);
  });
});



