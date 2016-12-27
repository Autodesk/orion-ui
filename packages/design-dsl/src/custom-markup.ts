import { deepEqual } from 'assert';
import { getNextToken, initWorld, Token, World, character, startTag, endTag, comment, getTokens } from './tokenizer';

const integration = `
  <!--awesome comments-->
  <orion>
  </orion>
`;

const actualIntegration = getTokens(integration);

const expectedIntegration = [
  character('\n'),
  character(' '),
  character(' '),
  comment('awesome comments'),
  character('\n'),
  character(' '),
  character(' '),
  startTag('orion'),
  character('\n'),
  character(' '),
  character(' '),
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
  } catch(e) {
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
  } catch(e) {
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
  } catch(e) {
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
  } catch(e) {
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

// quote, single-quote, <, or = are parse errors

// anything else start new attribute, set name to character and value to empty string


// const minAST: ASTNode = {
//   tagName: 'orion',
//   attributes: [],
//   children: []
// };

// deepEqual(parse(minimum), minAST);

// const withJSONValues = `
//   <orion
//     number=1
//     string="<hello world='thing' />"
//     boolean=true
//     array=[
//       "item1",
//       "item2",
//       "item3"
//     ]
//     object={
//       "key": "value",
//       "key2": ["value2"]
//     }>
//   </orion>
// `
// deepEqual(
//   getNextToken({
//     buffer: '',
//     state: 'tag-name',
//     currentToken: startTag('orion'),
//     currentAttribute: null,
//     tokens: [
//       character('\n'),
//       character(' '),
//       character(' ')
//     ]
//   }, '\n'),
//   {
//     buffer: '',
//     state: 'before-attribute-name',
//     currentToken: startTag('orion'),
//     currentAttribute: null,
//     tokens: [
//       character('\n'),
//       character(' '),
//       character(' ')
//     ]
//   }
// );

// // Ignore whitespace
// ['\t', '\r', '\n', ' '].forEach(char => {
//   deepEqual(
//     getNextToken({
//       buffer: '',
//       state: 'before-attribute-name',
//       currentToken: startTag('orion'),
//       currentAttribute: null,
//       tokens: [
//         character('\n'),
//         character(' '),
//         character(' ')
//       ]
//     }, char),
//     {
//       buffer: '',
//       state: 'before-attribute-name',
//       currentToken: startTag('orion'),
//       currentAttribute: null,
//       tokens: [
//         character('\n'),
//         character(' '),
//         character(' ')
//       ]
//     }
//   )
// });

// // ASCII Letter moves to attribute name state
// deepEqual(
//   getNextToken({
//     buffer: '',
//     state: 'before-attribute-name',
//     currentToken: startTag('orion'),
//     currentAttribute: null,
//     tokens: [
//       character('\n'),
//       character(' '),
//       character(' ')
//     ]
//   }, 'n'),
//   {
//     buffer: '',
//     state: 'attribute-name',
//     currentToken: startTag('orion', [
//       { name: 'n', value: '' }
//     ]),
//     currentAttribute: { name: 'n', value: '' },
//     tokens: [
//       character('\n'),
//       character(' '),
//       character(' ')
//     ]
//   }
// );

// // whitespace switches to after-attribute-name state
// ['\t', '\n', '\r', ' '].forEach(char => {
//   deepEqual(
//     getNextToken({
//       buffer: '',
//       state: 'attribute-name',
//       currentToken: startTag('orion', [
//         { name: 'n', value: '' }
//       ]),
//       currentAttribute: { name: 'n', value: '' },
//       tokens: [
//         character('\n'),
//         character(' '),
//         character(' ')
//       ]
//     }, char),
//     {
//       buffer: '',
//       state: 'after-attribute-name',
//       currentToken: startTag('orion', [
//         { name: 'n', value: '' }
//       ]),
//       currentAttribute: { name: 'n', value: '' },
//       tokens: [
//         character('\n'),
//         character(' '),
//         character(' ')
//       ]
//     }
//   )
// });



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