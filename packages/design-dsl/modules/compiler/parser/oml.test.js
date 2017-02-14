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

const { getTokens } = require('../../../2017-02-06/parser/tokenizer');

var grammar = require("./oml.js");
var nearley = require("nearley");

function parse(source) {
  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  const { tokens } = getTokens(source);
  p.feed(tokens);
  expect(p.results.length, 'Ambigious results!').to.equal(1);
  return p.results[0];
}

it('parses a single basic tag', () => {
  const ast = parse('<o></o>');
  expect(ast.type).to.equal('tag');
});

describe('valid open and close tag with whitespace', () => {
  let ast;

  beforeEach(() => {
    ast = parse(` <o> </o> `);
  });

  it('sets type to tag', () => {
    expect(ast.type).to.equal('tag');
  });

  it('sets name to the tag name', () => {
    expect(ast.name).to.equal('o');
  });

  it('sets attribs to empty object', () => {
    expect(ast.attribs).to.eql({});
  });

  it('sets children to empty array', () => {
    expect(ast.children).to.eql([]);
  });
});

describe('tagName', () => {
  it('lets tagName include a number', () => {
    const ast = parse("<orion1></orion1>");
    expect(ast.name).to.equal('orion1');
  });

  it('does not parse unmatched tags', () => {
    try {
      parse("<orion1></foo>");
    } catch (e) {
      expect(e.message).to.match(/No possible parsings \(\@2\:/);
    }
  });
});

describe('Attribute Names', () => {
  it('lets attribute name include a number', () => {
    const ast = parse("<o b1></o>");
    expect(ast.attribs.b1).to.equal(true);
  });
});

describe('boolean attribute', () => {
  it('sets a boolean attribute to true', () => {
    const ast = parse("<orion enabled></orion>");
    expect(ast.attribs.enabled).to.equal(true);
  });

  it('works when the boolean has a space', () => {
    const ast = parse("<orion enabled ></orion>");
    expect(ast.attribs.enabled).to.equal(true);
  });

  it('handles multiple booleans', () => {
    const ast = parse("<orion enabled disabled></orion>");
    expect(ast.attribs.enabled).to.equal(true);
    expect(ast.attribs.disabled).to.equal(true);
  });
});

describe('number attribute', () => {
  it('works without whitespace', () => {
    const ast = parse("<orion number=100></orion>");
    expect(ast.attribs.number).to.equal(100);
  });

  it('works with whitespace between equals sign', () => {
    const ast = parse("<orion number = 100></orion>");
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
      const ast = parse(permutation);
      expect(ast.attribs.number).to.equal(10);
      expect(ast.attribs.disabled).to.equal(true);
    });
  });
});

describe('double quoted string attribute', () => {
  it('works without whitespace', () => {
    const ast = parse(`<orion string="Hello World"></orion>`);
    expect(ast.attribs.string).to.equal("Hello World");
  });

  it('works with whitespace between equals sign', () => {
    const ast = parse(`<orion string = "Hello World"></orion>`);
    expect(ast.attribs.string).to.equal("Hello World");
  });

  it('works with multiple strings', () => {
    const ast = parse(`<orion string1="Hello World 1" string2="Hello World 2"></orion>`);
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
      const ast = parse(permutation);
      expect(ast.attribs.number).to.equal(10);
      expect(ast.attribs.disabled).to.equal(true);
      expect(ast.attribs.string).to.equal("Value");
    });
  });
});

describe('children', () => {
  it('supports a single child element', () => {
    const ast = parse(`<a><b></b></a>`)
    expect(ast.children.length).to.equal(1);
    expect(ast.children[0].name).to.equal('b');
    expect(ast.children[0].type).to.equal('tag');
  });

  it('supports a single child element with whitespace at the beginning', () => {
    const ast = parse(`<a> <b></b></a> `)
    expect(ast.children.length).to.equal(1);
  });

  it('supports a single child element with whitespace at the end', () => {
    const ast = parse(`<a><b></b> </a> `)
    expect(ast.children.length).to.equal(1);
  });

  it('supports multiple children', () => {
    const ast = parse(`<a><b></b><c></c></a>`);
    expect(ast.children.length).to.equal(2);

    expect(ast.children[0].name).to.equal('b');
    expect(ast.children[1].name).to.equal('c');
  });

  it('supports multiple children with whitespace', () => {
    [
      `<a> <b></b><c></c></a>`,
      `<a><b> </b><c></c></a>`,
      `<a><b></b> <c></c></a>`,
      `<a><b></b><c> </c></a>`,
      `<a><b></b><c></c> </a>`,
    ].forEach(permuation => {
      const ast = parse(permuation);
      expect(ast.children.length).to.equal(2);
    })
  });

  it('supports three levels of nesting', () => {
    const ast = parse(`<a><b><c></c></b></a>`);
    expect(ast.children[0].children[0].name).to.equal('c');
  });

  it('supports three levels of nesting with whitespace', () => {
    const ast = parse('<o>           <c> <t> </t> </c> </o>');
    expect(ast.children[0].children[0].name).to.equal('t');
  });
});