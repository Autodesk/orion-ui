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

describe('tagName', () => {
  it('lets tagName include a number', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed("<orion1></orion1>");

    const ast = p.results[0];
    expect(ast.name).to.equal('orion1');
  });
});

describe('Attribute Names', () => {
  it('lets attribute name include a number', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed("<orion boolean1 boolean2></orion>");

    const ast = p.results[0];
    expect(ast.attribs.boolean1).to.equal(true);
    expect(ast.attribs.boolean2).to.equal(true);
  });

  it('does not support a number at the start of an attribute name', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    try {
      p.feed("<orion 1number></orion>");
      throw new Error('did not catch');
    } catch (e) {
      expect(e.message).to.equal(`nearley: No possible parsings (@7: '1').`);
    }
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

describe('number attribute', () => {
  it('works without whitespace', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed("<orion number=100></orion>");

    const ast = p.results[0];
    expect(ast.attribs.number).to.equal(100);
  });

  it('works with whitespace between equals sign', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed("<orion number = 100></orion>");

    const ast = p.results[0];
    expect(ast.attribs.number).to.equal(100);
  });

  it('works with a mix of numbers and boolean', () => {
    [
      '<orion number=10 disabled></orion>',
      '<orion number = 10 disabled></orion>',
      '<orion number=10 disabled ></orion>',
      '<orion disabled number=10 ></orion>',
      '<orion disabled number = 10 ></orion>',
      '<orion disabled number=10></orion>'
    ].forEach(permutation => {
      const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(permutation);
      const ast = p.results[0];
      expect(ast.attribs.number).to.equal(10);
      expect(ast.attribs.disabled).to.equal(true);
    });
  });
});

describe('double quoted string attribute', () => {
  it('works without whitespace', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed(`<orion string="Hello World"></orion>`);

    const ast = p.results[0];
    expect(ast.attribs.string).to.equal("Hello World");
  });

  it('works with whitespace between equals sign', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed(`<orion string = "Hello World"></orion>`);

    const ast = p.results[0];
    expect(ast.attribs.string).to.equal("Hello World");
  });

  it('works with multiple strings', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

    p.feed(`<orion string1="Hello World 1" string2="Hello World 2"></orion>`);

    const ast = p.results[0];
    expect(ast.attribs.string1).to.equal("Hello World 1");
    expect(ast.attribs.string2).to.equal("Hello World 2");
  });

  it('works with a mix of string, boolean, and number', () => {
    [
      '<orion number=10 disabled string="Value"></orion>',
      '<orion number = 10 disabled string = "Value"></orion>',
      '<orion number=10 disabled string="Value" ></orion>',
      '<orion disabled string="Value" number=10 ></orion>',
      '<orion disabled string = "Value" number = 10 ></orion>',
      '<orion disabled string="Value" number=10></orion>'
    ].forEach(permutation => {
      const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(permutation);
      const ast = p.results[0];
      expect(ast.attribs.number).to.equal(10);
      expect(ast.attribs.disabled).to.equal(true);
      expect(ast.attribs.string).to.equal("Value");
    });
  });
});
