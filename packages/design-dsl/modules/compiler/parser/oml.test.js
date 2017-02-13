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

function parse(source) {
  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  p.feed(source);
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

  it('sets startIndex', () => {
    expect(ast.startIndex).to.eql(1);
  });
});

describe('tagName', () => {
  it('lets tagName include a number', () => {
    const ast = parse("<orion1></orion1>");
    expect(ast.name).to.equal('orion1');
  });

  it('does not parse unmatched tags', () => {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
    p.feed("<orion1></foo>");
    expect(p.results).to.eql([]);
  });

  it('lets endTag have some whitespace AFTER the tagName', () => {
    const ast = parse("<orion></orion >");
    expect(ast.name).to.equal('orion');
  });
});

describe('Attribute Names', () => {
  it('lets attribute name include a number', () => {
    const ast = parse("<o b1></o>");
    expect(ast.attribs.b1).to.equal(true);
  });

  it('does not support a number at the start of an attribute name', () => {
    try {
      parse("<orion 1number></orion>");
      throw new Error('did not catch');
    } catch (e) {
      expect(e.message).to.equal(`nearley: No possible parsings (@7: '1').`);
    }
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
    expect(ast.children[0].startIndex).to.equal(3);
  });

  it('supports a single child element with whitespace', () => {
    const ast = parse(`<a> <b></b></a>`)
    expect(ast.children.length).to.equal(1);
  });

  it('supports multiple children', () => {
    const ast = parse(`<a><b></b><c></c></a>`);
    expect(ast.children.length).to.equal(2);

    expect(ast.children[0].name).to.equal('b');
    expect(ast.children[1].name).to.equal('c');
  });
});