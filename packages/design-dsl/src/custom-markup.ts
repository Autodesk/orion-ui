import { deepEqual } from 'assert';
import { getNextToken, initWorld, Token, World, character, startTag, endTag, comment, getTokens, jsonAttr, bindingAttr, spaces, word } from './tokenizer';

const integration = `
  <!--awesome comments-->
  <orion
    something
    number=10
    string="<hello world='thing' />"
    array=["item1", ["item2", "item3"], "item4"]
    object={"key": "value", "key2": ["value2"], "key3": { "key4": "value4"}}
    binding={hello()}>
    <!--take each item and convert it to a text item-->
    <map collection=["item1", "item2"] => item, index>
      <text size=1>{item} {index + 1}</text>
    </map>
  </orion>
`;

const actualIntegration = getTokens(integration);

const expectedIntegration = [
  character('\n'),
  ...spaces(2),
  comment('awesome comments'),
  character('\n'),
  ...spaces(2),
  startTag('orion', [
    jsonAttr('something'),
    jsonAttr('number', '10'),
    jsonAttr('string', `"<hello world='thing' />"`),
    jsonAttr('array', `["item1", ["item2", "item3"], "item4"]`),
    jsonAttr('object', `{"key": "value", "key2": ["value2"], "key3": { "key4": "value4"}}`),
    bindingAttr('binding', 'hello()')
  ]),
  character('\n'),
  ...spaces(4),
  comment('take each item and convert it to a text item'),
  character('\n'),
  ...spaces(4),
  startTag('map', [
    jsonAttr('collection', '["item1", "item2"]')
  ], false, ['item', 'index']),
  character('\n'),
  ...spaces(6),
  startTag('text', [
    jsonAttr('size', '1')
  ]),
  ...word('{item} {index + 1}'),
  endTag('text'),
  character('\n'),
  ...spaces(4),
  endTag('map'),
  character('\n'),
  ...spaces(2),
  endTag('orion'),
  character('\n')
];

deepEqual(actualIntegration, expectedIntegration);

/**
 * data state
 */

// < switches to tag open state
{
  const prev = initWorld();

  const next = initWorld();
  next.state = 'tag-open';

  deepEqual(getNextToken(prev, '<'), next);
}

// anything else emits as character
{
  ['\n', 'f', '1', ' '].forEach(char => {
    const prev = initWorld();
    const next = initWorld();
    next.tokens = [character(char)];
    deepEqual(getNextToken(prev, char), next);
  });
}

/**
 * tag open state
 */

// ! switches to markup declaration open state
{
  const prev = initWorld();
  prev.state = 'tag-open';

  const next = initWorld();
  next.state = 'markup-declaration-open';

  deepEqual(getNextToken(prev, '!'), next);
}

// / switches to end-tag-open state
{
  const prev = initWorld();
  prev.state = 'tag-open';

  const next = initWorld();
  next.state = 'end-tag-open';

  deepEqual(getNextToken(prev, '/'), next);
}

// Uppercase ASCII creates new start tag token with tag name set to lowercase
// version of the current input character then switches to tag name state
{
  const prev = initWorld();
  prev.state = 'tag-open';

  const next = initWorld();
  next.state = 'tag-name';
  next.currentToken = startTag('a')

  deepEqual(getNextToken(prev, 'A'), next);
}

// Lowercase ASCII creates new start tag as well
{
  const prev = initWorld();
  prev.state = 'tag-open';

  const next = initWorld();
  next.state = 'tag-name';
  next.currentToken = startTag('a')

  deepEqual(getNextToken(prev, 'a'), next);
}

// non ascii characters are parse errors
[' ', '\n'].forEach(char => {
  const prev = initWorld();
  prev.state = 'tag-open';
  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

/**
 * markup declaration open state
 */

// if next two characters are both -, create comment token
// and switch to comment-start state
{
  const prev = initWorld();
  prev.state = 'markup-declaration-open';

  const next1 = initWorld();
  next1.buffer = '-';
  next1.state = 'markup-declaration-open';

  deepEqual(getNextToken(prev, '-'), next1);

  const next2 = initWorld();
  next2.buffer = '';
  next2.state = 'comment-start';
  next2.currentToken = comment('');

  deepEqual(getNextToken(next1, '-'), next2);
}

// otherwise parse error
['a', 'A', '\n'].forEach(char => {
  const prev = initWorld();
  prev.state = 'markup-declaration-open';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

/**
 * comment-start
 */

// comment-start-dash transition
{
  const prev = initWorld();
  prev.state = 'comment-start';

  const next = initWorld();
  next.state = 'comment-start-dash';

  deepEqual(getNextToken(prev, '-'), next);
}

// parser error
{
  const prev = initWorld();
  prev.state = 'comment-start';
  prev.currentToken = comment('');

  try {
    getNextToken(prev, '>');
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
}

// appending comment text
['a', 'b', ' ', '\n'].forEach(char => {
  const prev = initWorld();
  prev.state = 'comment-start';
  prev.currentToken = comment('');

  const next = initWorld();
  next.state = 'comment';
  next.currentToken = comment(char);

  deepEqual(getNextToken(prev, char), next)
});

/**
 * comment state
 */

// - switches to commend end dash state
{
  const prev = initWorld();
  prev.state = 'comment';

  const next = initWorld();
  next.state = 'comment-end-dash';

  deepEqual(getNextToken(prev, '-'), next);
}

// anything else appends to comment
[' ', 'a', 'A', '\n'].forEach(char => {
  const prev = initWorld();
  prev.state = 'comment';
  prev.currentToken = comment('f');

  const next = initWorld();
  next.state = 'comment';
  next.currentToken = comment(`f${char}`);

  deepEqual(getNextToken(prev, char), next);
});

/**
 * comment-start-dash
 */

// - switches to comment-end state
{
  const prev = initWorld();
  prev.state = 'comment-start-dash';

  const next = initWorld();
  next.state = 'comment-end';

  deepEqual(getNextToken(prev, '-'), next);
}

// > is a parser error
{
  const prev = initWorld();
  prev.state = 'comment-start-dash';

  try {
    getNextToken(prev, '>');
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
}

// anything else append - (dash) and the current input character to comment
// and switch to comment state
['a', '\n', ' ', 'A'].forEach(char => {
  const prev = initWorld();
  prev.state = 'comment-start-dash';
  prev.currentToken = comment('');

  const next = initWorld();
  next.state = 'comment';
  next.currentToken = comment(`-${char}`);

  deepEqual(getNextToken(prev, char), next);
});

/**
 * comment-end-dash
 */

// - switches to comment-end
{
  const prev = initWorld();
  prev.state = 'comment-end-dash';

  const next = initWorld()
  next.state = 'comment-end';

  deepEqual(getNextToken(prev, '-'), next);
}

// anything else append - (dash) and the current input character to comment
// and switch to comment state
['a', '\n', ' ', 'A'].forEach(char => {
  const prev = initWorld();
  prev.state = 'comment-end-dash';
  prev.currentToken = comment('');

  const next = initWorld();
  next.state = 'comment';
  next.currentToken = comment(`-${char}`);

  deepEqual(getNextToken(prev, char), next);
});

/**
 * comment-end
 */

// > switches to data state and emits comment token
{
  const prev = initWorld();
  prev.state = 'comment-end';
  prev.currentToken = comment('hello');

  const next = initWorld();
  next.state = 'data';
  next.currentToken = null;
  next.tokens = [comment('hello')];

  deepEqual(getNextToken(prev, '>'), next);
}

// - append (dash) to comment token data
{
  const prev = initWorld();
  prev.state = 'comment-end';
  prev.currentToken = comment('hello');

  const next = initWorld();
  next.state = 'comment-end';
  next.currentToken = comment('hello-');

  deepEqual(getNextToken(prev, '-'), next);
}

// anything else append two (dash) and switch to comment state
['\n', 'a', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'comment-end';
  prev.currentToken = comment('hello');

  const next = initWorld();
  next.state = 'comment';
  next.currentToken = comment(`hello--${char}`);

  deepEqual(getNextToken(prev, char), next);
});

/**
 * end-tag-open state
 */

// Uppercase ASCII
// create new end tag token, set its tag name to lowercase version, switch to tag name state
{
  const prev = initWorld();
  prev.state = 'end-tag-open';

  const next = initWorld();
  next.state = 'tag-name';
  next.currentToken = endTag('a')

  deepEqual(getNextToken(prev, 'A'), next);
}

// Lowercase ASCII
// create new end tag token, set its name to character, switch to tag name state
{
  const prev = initWorld();
  prev.state = 'end-tag-open';

  const next = initWorld();
  next.state = 'tag-name';
  next.currentToken = endTag('a')

  deepEqual(getNextToken(prev, 'a'), next);
}

// Anything else, parse error
['\n', '>'].forEach(char => {
  const prev = initWorld();
  prev.state = 'end-tag-open';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

/**
 * tag-name state
 */

// tab, LF, space switch to before-attribute-name state
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'tag-name';

  const next = initWorld();
  next.state = 'before-attribute-name';

  deepEqual(getNextToken(prev, char), next);
});

// / switch to self-closing-start-tag state

{
  const prev = initWorld();
  prev.state = 'tag-name';

  const next = initWorld();
  next.state = 'self-closing-start-tag';

  deepEqual(getNextToken(prev, '/'), next);
}

// > switch to data state and emit current tag token
{
  const prev = initWorld();
  prev.state = 'tag-name';
  prev.currentToken = startTag('foo');
  prev.tokens = [character('a')]

  const next = initWorld();
  next.state = 'data';
  next.currentToken = null;
  next.tokens = [character('a'), startTag('foo')];

  deepEqual(getNextToken(prev, '>'), next);
}

// Uppercase ASCII letter append lowercase version to token tag name
{
  const prev = initWorld();
  prev.state = 'tag-name';
  prev.currentToken = startTag('foo');

  const next = initWorld();
  next.state = 'tag-name';
  next.currentToken = startTag('foob');

  deepEqual(getNextToken(prev, 'B'), next);
}

// anything else append to token tag name
{
  const prev = initWorld();
  prev.state = 'tag-name';
  prev.currentToken = startTag('foo');

  const next = initWorld();
  next.state = 'tag-name';
  next.currentToken = startTag('foob');

  deepEqual(getNextToken(prev, 'b'), next);
}

/**
 * self-closing-start-tag state
 */

// > sets self-closing flag of current tag token, switch to data state, emit token
{
  const prev = initWorld();
  prev.state = 'self-closing-start-tag';
  prev.currentToken = startTag('a');
  prev.tokens = [character('a')];

  const next = initWorld();
  next.state = 'data';
  next.currentToken = null;
  next.tokens = [character('a'), startTag('a', [], true)];

  deepEqual(getNextToken(prev, '>'), next);
}

// anything else is a parse error
{
  const prev = initWorld();
  prev.state = 'self-closing-start-tag';

  try {
    getNextToken(prev, 'a');
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
}

/**
 * before-attribute-name state
 */

// tab, LF, space are ignored
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-attribute-name';

  const next = initWorld();
  next.state = 'before-attribute-name';

  deepEqual(getNextToken(prev, char), next);
});

// / switches to self-closing-start-tag state
{
  const prev = initWorld();
  prev.state = 'before-attribute-name';

  const next = initWorld();
  next.state = 'self-closing-start-tag';

  deepEqual(getNextToken(prev, '/'), next);
}

// > switch to data state, emit current tag token
{
  const prev = initWorld();
  prev.state = 'before-attribute-name';
  prev.currentToken = startTag('a');
  prev.tokens = [character('b')];

  const next = initWorld();
  next.state = 'data';
  next.currentToken = null;
  next.tokens = [character('b'), startTag('a')];

  deepEqual(getNextToken(prev, '>'), next);
}

// uppercase ASCII
// = start new attribute, set name to lowercase version and value to empty string
// transition to attribute-name
{
  const prev = initWorld();
  prev.state = 'before-attribute-name';
  prev.currentToken = startTag('a');

  const next = initWorld();
  next.state = 'attribute-name';
  next.currentAttribute = jsonAttr('b', '');
  next.currentToken = startTag('a', [
    jsonAttr('b', '')
  ]);

  deepEqual(getNextToken(prev, 'B'), next);
}

// = switch to before-block state
{
  const prev = initWorld();
  prev.state = 'before-attribute-name';

  const next = initWorld();
  next.state = 'before-block';

  deepEqual(getNextToken(prev, '='), next);
}

// quote, single-quote, <, or = are parse errors
[`"`, `'`, '<'].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-attribute-name';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

// anything else start new attribute, set name to character and value to empty string
{
  const prev = initWorld();
  prev.state = 'before-attribute-name';
  prev.currentToken = startTag('a');

  const next = initWorld();
  next.state = 'attribute-name';
  next.currentAttribute = jsonAttr('b', '');
  next.currentToken = startTag('a', [
    jsonAttr('b', '')
  ]);

  deepEqual(getNextToken(prev, 'b'), next);
}

/**
 * before-block state
 */

// > switch to before-block-parameter state
{
  const prev = initWorld();
  prev.state = 'before-block';

  const next = initWorld();
  next.state = 'before-block-parameter';

  deepEqual(getNextToken(prev, '>'), next);
}

// anything else is a parse error
['a', '\n', '\t', ' ', '1'].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-block';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

/**
 * before-block-parameter state
 */

// tab, LF, space are ignored
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-block-parameter';

  const next = initWorld();
  next.state = 'before-block-parameter';

  deepEqual(getNextToken(prev, char), next);
});

// ASCII letter
// - creates a new block parameter with value on current tag token
// - switches to block-parameter state
['a', 'A', 'z', 'Z'].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-block-parameter'
  prev.currentToken = startTag('a');

  const next = initWorld();
  next.currentToken = startTag('a', [], false, [char]);
  next.state = 'block-parameter';

  deepEqual(getNextToken(prev, char), next);
});

// anything else is a parse error
['1', '>', '='].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-block-parameter';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});


/**
 * block-parameter-state
 */

// ASCII letter appends character to current block parameter value
{
  const prev = initWorld();
  prev.state = 'block-parameter';
  prev.currentToken = startTag('a', [], false, ['a']);

  const next = initWorld();
  next.state = 'block-parameter';
  next.currentToken = startTag('a', [], false, ['ab']);

  deepEqual(getNextToken(prev, 'b'), next);
}


// , switches to before-block-parameter state
{
  const prev = initWorld();
  prev.state = 'block-parameter';

  const next = initWorld();
  next.state = 'before-block-parameter';

  deepEqual(getNextToken(prev, ','), next);
}

// > switch to data state, emit current tag token
{
  const prev = initWorld();
  prev.state = 'block-parameter';
  prev.currentToken = startTag('a', [], false, ['a']);

  const next = initWorld();
  next.state = 'data';
  next.currentToken = null;
  next.tokens = [startTag('a', [], false, ['a'])];

  deepEqual(getNextToken(prev, '>'), next);
}

// anything else is a parse error
['\t', ' ', '\n', '1', '<', '='].forEach(char => {
  const prev = initWorld();
  prev.state = 'block-parameter';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

/**
 * attribute-name state
 */

// tab, LF, space switch to after attribute name state
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'attribute-name';

  const next = initWorld();
  next.state = 'after-attribute-name';

  deepEqual(getNextToken(prev, char), next);
});

// / switch to self-closing-start-tag state
{
  const prev = initWorld();
  prev.state = 'attribute-name';

  const next = initWorld();
  next.state = 'self-closing-start-tag';

  deepEqual(getNextToken(prev, '/'), next);
}

// = switch to before-attribute-value state
{
  const prev = initWorld();
  prev.state = 'attribute-name';

  const next = initWorld();
  next.state = 'before-attribute-value';

  deepEqual(getNextToken(prev, '='), next);
}

// > switch to data state, emit current tag token
{
  const prev = initWorld();
  prev.state = 'attribute-name';
  prev.currentAttribute = jsonAttr('b', '');
  prev.currentToken = startTag('a', [
    jsonAttr('b', '')
  ]);
  prev.tokens = [character('a')];

  const next = initWorld();
  next.state = 'data';
  next.currentAttribute = null;
  next.currentToken = null;
  next.tokens = [character('a'), startTag('a', [
    jsonAttr('b', '')
  ])];

  deepEqual(getNextToken(prev, '>'), next);
}

// Uppercase letter = append lowercase version to current attribute name
{
  const prev = initWorld();
  prev.state = 'attribute-name';
  prev.currentAttribute = jsonAttr('b', '');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-name';
  next.currentAttribute = jsonAttr('ba', '');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, 'A'), next);
}

// quote, singlequote, < are parse errors
[`"`, `'`, '<'].forEach(char => {
  const prev = initWorld();
  prev.state = 'attribute-name';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

// anything else is append to current attribute name
{
  const prev = initWorld();
  prev.state = 'attribute-name';
  prev.currentAttribute = jsonAttr('b', '');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-name';
  next.currentAttribute = jsonAttr('bq', '');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, 'q'), next);
}

/**
 * after-attribute-name state
 */

// tab, LF, space are ignored
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'after-attribute-name';

  const next = initWorld();
  next.state = 'after-attribute-name';

  deepEqual(getNextToken(prev, char), next);
});

// / switch to self-closing-start-tag state
{
  const prev = initWorld();
  prev.state = 'after-attribute-name';

  const next = initWorld();
  next.state = 'self-closing-start-tag';

  deepEqual(getNextToken(prev, '/'), next);
}

// = switch to before-attribute-value state
{
  const prev = initWorld();
  prev.state = 'after-attribute-name';

  const next = initWorld();
  next.state = 'before-attribute-value';

  deepEqual(getNextToken(prev, '='), next);
}

// > switch to data state and emit current tag token
{
  const prev = initWorld();
  prev.state = 'after-attribute-name';
  prev.currentAttribute = jsonAttr('b', '');
  prev.currentToken = startTag('a', [
    jsonAttr('b', '')
  ]);
  prev.tokens = [character('a')];

  const next = initWorld();
  next.state = 'data';
  next.currentAttribute = null;
  next.currentToken = null;
  next.tokens = [character('a'), startTag('a', [
    jsonAttr('b', '')
  ])];

  deepEqual(getNextToken(prev, '>'), next);
}

// Uppercase ASCII Letter
// - start new attribute in current tag token
// - set name to lowercase character
// - set value to empty string
// - switch to attribute-name state
{
  const prev = initWorld();
  prev.state = 'after-attribute-name';
  prev.currentAttribute = null;
  prev.currentToken = startTag('a', [
    jsonAttr('prev', 'foo')
  ]);

  const next = initWorld();
  next.state = 'attribute-name';
  next.currentAttribute = jsonAttr('a', '');
  next.currentToken = startTag('a', [
    jsonAttr('prev', 'foo'),
    jsonAttr('a', '')
  ]);

  deepEqual(getNextToken(prev, 'A'), next);
}

// quote, singlequote, < are parser errors
[`"`, `'`, '<'].forEach(char => {
  const prev = initWorld();
  prev.state = 'after-attribute-name';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

// anything else is same as uppercase ASCII letter
{
  const prev = initWorld();
  prev.state = 'after-attribute-name';
  prev.currentAttribute = null;
  prev.currentToken = startTag('a', [
    jsonAttr('prev', 'foo')
  ]);

  const next = initWorld();
  next.state = 'attribute-name';
  next.currentAttribute = jsonAttr('z', '');
  next.currentToken = startTag('a', [
    jsonAttr('prev', 'foo'),
    jsonAttr('z', '')
  ]);

  deepEqual(getNextToken(prev, 'z'), next);
}

/**
 * before-attribute-value state
 */

// tab, LF, space are ignored
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-attribute-value';

  const next = initWorld();
  next.state = 'before-attribute-value';

  deepEqual(getNextToken(prev, char), next);
});

// quote switches to attribute-value-string state + append value
{
  const prev = initWorld();
  prev.state = 'before-attribute-value';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-string';
  next.currentAttribute = jsonAttr('name', '"');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '"'), next);
}

// [0-9] switches to attribute-value-number state + append value
for (let i = 0; i < 10; i++) {
  const char = i.toString();

  const prev = initWorld();
  prev.state = 'before-attribute-value';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-number';
  next.currentAttribute = jsonAttr('name', char);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, char), next);
}

// [ switches to attribute-value-array state + append value
{
  const prev = initWorld();
  prev.state = 'before-attribute-value';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-array';
  next.currentAttribute = jsonAttr('name', '[');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '['), next);
}

// { switches to attribute-value-object-or-binding state
{
  const prev = initWorld();
  prev.state = 'before-attribute-value';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-object-or-binding';
  next.currentAttribute = jsonAttr('name');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '{'), next);
}

// anything else is a parse error
['>', 'r', '='].forEach(char => {
  const prev = initWorld();
  prev.state = 'before-attribute-value';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

/**
 * attribute-value-string state
 */

// quotation mark switches to after-attribute-value state + append value
{
  const prev = initWorld();
  prev.state = 'attribute-value-string';
  prev.currentAttribute = jsonAttr('name', `"something`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'after-attribute-value';
  next.currentAttribute = jsonAttr('name', `"something"`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, `"`), next);
}

// anything else - append to value
{
  const prev = initWorld();
  prev.state = 'attribute-value-string';
  prev.currentAttribute = jsonAttr('name', `"somethin`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-string';
  next.currentAttribute = jsonAttr('name', `"something`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, `g`), next);
}

/**
 * attribute-value-number state
 */

// tab, new line, space switches to before-attribute-name state
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'attribute-value-number';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'before-attribute-name';
  next.currentAttribute = jsonAttr('name');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, char), next);
});

// / switches to self-closing-start-tag state
{
  const prev = initWorld();
  prev.state = 'attribute-value-number';
  prev.currentAttribute = jsonAttr('name', '1');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'self-closing-start-tag';
  next.currentAttribute = jsonAttr('name', '1');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '/'), next);
}

// > switches to data state and emits current tag token
{
  const prev = initWorld();
  prev.state = 'attribute-value-number';
  prev.currentAttribute = jsonAttr('name', '10');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);
  prev.tokens = [character('c')];

  const next = initWorld();
  next.state = 'data';
  next.currentAttribute = null;
  next.currentToken = null;
  next.tokens = [character('c'), startTag('a', [jsonAttr('name', '10')])]

  deepEqual(getNextToken(prev, '>'), next);
}

// [0-9] appends to value
for (let i = 0; i < 10; i++) {
  const char = i.toString();

  const prev = initWorld();
  prev.state = 'attribute-value-number';
  prev.currentAttribute = jsonAttr('name', '1');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-number';
  next.currentAttribute = jsonAttr('name', `1${char}`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, char), next);
}

// anything else is parse error
['r', '='].forEach(char => {
  const prev = initWorld();
  prev.state = 'attribute-value-number';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

/**
 * attribute-value-array state
 */

// ]
// - append value
// - if parsable by json it switches to after-attribute-value state

// ] when parsable by json switches to after-attribute-value state
{
  const prev = initWorld();
  prev.state = 'attribute-value-array';
  prev.currentAttribute = jsonAttr('name', `["one", "two"`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'after-attribute-value';
  next.currentAttribute = jsonAttr('name', `["one", "two"]`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, ']'), next);
}

// ] when not parsable by json appends the value and stays in same state
{
  const prev = initWorld();
  prev.state = 'attribute-value-array';
  prev.currentAttribute = jsonAttr('name', `["one", "two`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-array';
  next.currentAttribute = jsonAttr('name', `["one", "two]`)
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, ']'), next);
}

// anything else
// - append value
{
  const prev = initWorld();
  prev.state = 'attribute-value-array';
  prev.currentAttribute = jsonAttr('name', `[`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-array';
  next.currentAttribute = jsonAttr('name', `["`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '"'), next);
}

/**
 * attribute-value-object-or-binding state
 */

// tab, newline, space is ignored
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'attribute-value-object-or-binding';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-object-or-binding';
  next.currentAttribute = jsonAttr('name');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, char), next);
});

// quote
// - switches to attribute-value-object state
// - append { to value
// - append " to value
{
  const prev = initWorld();
  prev.state = 'attribute-value-object-or-binding';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-object';
  next.currentAttribute = jsonAttr('name', `{"`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '"'), next);
}

// anything else
// - switches to attribute-value-binding state
// - append value
{
  const prev = initWorld();
  prev.state = 'attribute-value-object-or-binding';
  prev.currentAttribute = jsonAttr('name');
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-binding';
  next.currentAttribute = bindingAttr('name', 'l');
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, 'l'), next);
}

/**
 * attribute-value-object state
 */

// }
// - append value
// - if parsable by json it switches to after-attribute-value state

// } when parsable by json switches to after-attribute-value state
{
  const prev = initWorld();
  prev.state = 'attribute-value-object';
  prev.currentAttribute = jsonAttr('name', `{"key": "value"`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'after-attribute-value';
  next.currentAttribute = jsonAttr('name', `{"key": "value"}`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '}'), next);
}

// } when not parsable by json buffers the value and keeps same state
{
  const prev = initWorld();
  prev.state = 'attribute-value-object';
  prev.currentAttribute = jsonAttr('name', `{"`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-object';
  next.currentAttribute = jsonAttr('name', `{"}`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '}'), next);
}

// anything else
// - append value

{
  const prev = initWorld();
  prev.state = 'attribute-value-object';
  prev.currentAttribute = jsonAttr('name', `{`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-object';
  next.currentAttribute = jsonAttr('name', `{ `);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, ' '), next);
}

/**
 * attribute-value-binding state
 */

// } switch to after-attribute-value state
{
  const prev = initWorld();
  prev.state = 'attribute-value-binding';
  prev.currentAttribute = jsonAttr('name', `a`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'after-attribute-value';
  next.currentAttribute = jsonAttr('name', `a`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '}'), next);
}

// anything else, append value
{
  const prev = initWorld();
  prev.state = 'attribute-value-binding';
  prev.currentAttribute = jsonAttr('name', `a`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'attribute-value-binding';
  next.currentAttribute = jsonAttr('name', `ab`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, 'b'), next);
}

/**
 * after-attribute-value state
 */

// tab, lf, ff, space switches to before-attribute-name state
['\t', '\n', ' '].forEach(char => {
  const prev = initWorld();
  prev.state = 'after-attribute-value';
  prev.currentAttribute = jsonAttr('name', `a`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'before-attribute-name';
  next.currentAttribute = jsonAttr('name', `a`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, char), next);
});

// / switches to self-closing start tag state
{
  const prev = initWorld();
  prev.state = 'after-attribute-value';
  prev.currentAttribute = jsonAttr('name', `a`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);

  const next = initWorld();
  next.state = 'self-closing-start-tag';
  next.currentAttribute = jsonAttr('name', `a`);
  next.currentToken = startTag('a', [
    next.currentAttribute
  ]);

  deepEqual(getNextToken(prev, '/'), next);
}

// > switches to data state and emits current tag token
{
  const prev = initWorld();
  prev.state = 'after-attribute-value';
  prev.currentAttribute = jsonAttr('name', `a`);
  prev.currentToken = startTag('a', [
    prev.currentAttribute
  ]);
  prev.tokens = [character('c')];

  const next = initWorld();
  next.state = 'data';
  next.currentAttribute = null;
  next.currentToken = null;
  next.tokens = [character('c'), startTag('a', [jsonAttr('name', 'a')])]

  deepEqual(getNextToken(prev, '>'), next);
}

// anything else is parse error
['a', '1', '<'].forEach(char => {
  const prev = initWorld();
  prev.state = 'after-attribute-value';

  try {
    getNextToken(prev, char);
    throw new Error('did not cause exception');
  } catch (e) {
    deepEqual(e.message, 'unknown character');
  }
});

// const withJSONValuesAST: ASTNode = {
//   tagName: 'orion',
//   attributes: [
//     {
//       type: 'jsobject',
//       identifier: 'number',
//       value: 1
//     },
//     {
//       type: 'jsobject',
//       identifier: 'string',
//       value: `<hello world='thing' />`
//     },
//     {
//       type: 'jsobject',
//       identifier: 'boolean',
//       value: true
//     },
//     {
//       type: 'jsobject',
//       identifier: 'array',
//       value: ['item1', 'item2', 'item3']
//     },
//     {
//       type: 'jsobject',
//       identifier: 'object',
//       value: { key: 'value', key2: ['value2'] }
//     }
//   ],
//   children: []
// };

// deepEqual(parse(withJSONValues), withJSONValuesAST);

// const withChild = `
//   <orion import=["toolbar"]>
//     <image src="hello.png"></image>
//   </orion>
// `;

// const withChildAST: ASTNode = {
//   tagName: 'orion',
//   attributes: [
//     {
//       type: 'jsobject',
//       identifier: 'import',
//       value: ['toolbar']
//     }
//   ],
//   children: [
//     {
//       tagName: 'image',
//       attributes: [
//         {
//           type: 'jsobject',
//           identifier: 'src',
//           value: 'hello.png'
//         }
//       ],
//       children: []
//     }
//   ]
// }

// deepEqual(parse(withChild), withChildAST);

// const withSelfClosing = `
//   <orion>
//     <image src="hello.png" />
//   </orion>
// `

// const withSelfClosingAST: ASTNode = {
//   tagName: 'orion',
//   attributes: [],
//   children: [
//     {
//       tagName: 'image',
//       attributes: [
//         {
//           identifier: 'src',
//           type: 'jsobject',
//           value: 'hello.png'
//         }
//       ],
//       children: []
//     }
//   ]
// }

// deepEqual(parse(withSelfClosing), withSelfClosingAST);

// const withNestedJson = `
//   <orion
//   array=[
//     ["foo1", "bar1"],
//     ["foo2", "bar2"]
//   ]

//   object={
//     "key": {
//       "sub-key": "value"
//     }
//   }>
//   </orion>
// `

// const withNestedJsonAST: ASTNode = {
//   tagName: 'orion',
//   attributes: [
//     {
//       type: 'jsobject',
//       identifier: 'array',
//       value: [
//         ['foo1', 'bar1'],
//         ['foo2', 'bar2']
//       ]
//     },
//     {
//       type: 'jsobject',
//       identifier: 'object',
//       value: {
//         key: {
//           'sub-key': 'value'
//         }
//       }
//     }
//   ],
//   children: []
// }

// deepEqual(parse(withNestedJson), withNestedJsonAST);

// const withBadJson = `
//   <orion
//     good="value"
//     array=[
//       ["foo1", "bar"
//     ]>
//   </orion>
// `;

// try {
//   parse(withBadJson)
// } catch (e) {
//   deepEqual(e.message, 'array has a bad value.');
// }

// const lambda = `
//   <orion collection=["one", "two", "three"] => item, index>
//     <image />
//   </orion>
// `;

// const lambdaAST: ASTNode = {
//   tagName: 'orion',
//   attributes: [
//     {
//       type: 'jsobject',
//       identifier: 'collection',
//       value: ['one', 'two', 'three']
//     },
//     {
//       type: 'lambda',
//       bindings: ['item', 'index'],
//       children: [
//         {
//           tagName: 'image',
//           attributes: [],
//           children: []
//         }
//       ]
//     }
//   ],
//   children: []
// }

// deepEqual(parse(lambda), lambdaAST);

// const lambadWithIdError = `
//   <orion => 123>
//   </orion>
// `

// try {
//   parse(lambadWithIdError)
// } catch (e) {
//   deepEqual(e.message, '123 is not an ES2015 compatible identifier.');
// }

// const lambdaWithNoBindings = `
//   <orion =>
//     <image />
//   </orion>`

// try {
//   parse(lambdaWithNoBindings)
// } catch (e) {
//   deepEqual(e.message, '<image/ is not an ES2015 compatible identifier.');
// }

// const attributeBinding = `
// <orion collection={ count(collection) } object={ "key": "value" }>
//   <child label={ item } />
// </orion>
// `

// const attributeBindingAST: ASTNode = {
//   tagName: 'orion',
//   attributes: [
//     {
//       type: 'binding',
//       identifier: 'collection',
//       value: ' count(collection) '
//     },
//     {
//       type: 'jsobject',
//       identifier: 'object',
//       value: {
//         "key": "value"
//       }
//     }
//   ],

//   children: [
//     {
//       tagName: 'child',
//       attributes: [
//         {
//           type: 'binding',
//           identifier: 'label',
//           value: ' item '
//         }
//       ],

//       children: []
//     }
//   ]
// }

// deepEqual(parse(attributeBinding), attributeBindingAST)

// const lambda2 = `
//   <container>
//     <let collection=["one", "two", "three"]>
//       <map collection=collection => item, index>
//         <text>{ index + 1 } {item}</text>
//       </map>
//       <text>{ count(collection) }</text>
//     </let>
//   </container>
// `;

// const source = `
// <orion>
//   <component => items>
//     <container display="flex" layout="row" paddingAll="small" background="black">
//       <map items => item, index>
//         <container display="flex" layout="row" paddingAll="medium" background="grey">
//           <image src={item.src} height={item.height} width={item.width} />
//           <text textContent={item.label} />
//         </container>
//       </map>
//     </container>
//   </component>
// </orion>
// `;

// const exampleArray = `
// <orion import=["toolbar"]>
//   <toolbar items=[
//     { "label": "item 1", src: "item1.png", "height": 100, "width": 100},
//     { "label": "item 2", src: "item2.png", "height": 100, "width": 100},
//     { "label": "item 3", src: "item3.png", "height": 100, "width": 100}] />
// </orion>
// `;

// // syntax
// // general form of a function call is<fn-name args>block</fn-name>
// // => declares a first class function
// // everything before => is arguments
// // everything after => are function arguments
// // arguments are , separated
// // attributes are space seperated key="value"
// // attribute values can be any JavaScript literal which can serialize to JSON
// // curly braces {} are bindings, everything inside is captured as a string to be evaled later when the env is present

// const newSourceJSON: ASTNode = {
//   tagName: 'orion',
//   attributes: [
//     {
//       type: 'jsobject',
//       identifier: 'import',
//       value: []
//     }
//   ],
//   children: [
//     {
//       tagName: 'component',
//       attributes: [
//         {
//           type: 'lambda',
//           bindings: ['items'],
//           children: [
//             {
//               tagName: 'container',
//               attributes: [
//                 { type: 'jsobject', identifier: 'display', value: 'flex' },
//                 { type: 'jsobject', identifier: 'layout', value: 'row' },
//                 { type: 'jsobject', identifier: 'paddingAll', value: 'small' },
//                 { type: 'jsobject', identifier: 'background', value: 'black' }
//               ],

//               children: [
//                 {
//                   tagName: 'map',
//                   attributes: [
//                     {
//                       type: 'jsobject',
//                       identifier: 'items',
//                       value: true
//                     },
//                     {
//                       type: 'lambda',
//                       bindings: ['item', 'index'],
//                       children: [
//                         {
//                           tagName: 'container',
//                           attributes: [
//                             { type: 'jsobject', identifier: 'display', value: 'flex' },
//                             { type: 'jsobject', identifier: 'layout', value: 'row' },
//                             { type: 'jsobject', identifier: 'paddingAll', value: 'medium' },
//                             { type: 'jsobject', identifier: 'background', value: 'grey' }
//                           ],
//                           children: [
//                             {
//                               tagName: 'image',
//                               attributes: [
//                                 {
//                                   type: 'binding',
//                                   identifier: 'src',
//                                   value: 'item.src'
//                                 },
//                                 {
//                                   type: 'binding',
//                                   identifier: 'height',
//                                   value: 'item.height'
//                                 },
//                                 {
//                                   type: 'binding',
//                                   identifier: 'width',
//                                   value: 'item.width'
//                                 }
//                               ],
//                               children: []
//                             },
//                             {
//                               tagName: 'text',
//                               attributes: [
//                                 {
//                                   type: 'binding',
//                                   identifier: 'textContent',
//                                   value: 'item.label'
//                                 }
//                               ],
//                               children: []
//                             }
//                           ]
//                         }
//                       ]
//                     }
//                   ],
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       ],

//       children: []
//     }
//   ]
// };

// // const sourceAST = tokenize(source);

// const newExampleArrayJson: ASTNode = {
//   tagName: 'orion',
//   attributes: [
//     {
//       type: 'jsobject',
//       identifier: 'import',
//       value: ['toolbar']
//     }
//   ],

//   children: [
//     {
//       tagName: 'toolbar',
//       attributes: [
//         {
//           type: 'jsobject',
//           identifier: 'items',
//           value: [
//             { label: 'item 1', src: 'item1.png', height: 100, width: 100 },
//             { label: 'item 2', src: 'item2.png', height: 100, width: 100 },
//             { label: 'item 3', src: 'item3.png', height: 100, width: 100 }
//           ]
//         }
//       ],
//       children: []
//     }
//   ],
// };

// // PLAN

// /**
//  * compile toolbar.orn -> toolbar.js
//  * - whatever the top level form is becomes the es6 default export
//  * - components become functions which take props
//  * - primitives become JSON objects
//  *
//  * // look at building a babel-register style importer
//  *
//  * Rendering
//  *
//  * import toolbar from './toolbar'; (after compiled)
//  *
//  */

// // tokenize - source -> AST (json serializable)
// // eval(ast, env)