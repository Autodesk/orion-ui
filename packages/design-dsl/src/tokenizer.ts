import { WHITESPACE } from './parser';

const ASCII = /[a-zA-Z]/;
const DIGIT = /[0-9]/;
export const EOF_CHARACTER = '@@EOF@@';

/**
 * Replace an item in the collection and return a new collection
 */
function replaceItem<T>(collection: T[], prev: T, next: T): T[] {
  const index = collection.indexOf(prev);

  return [
    ...collection.slice(0, index),
    next,
    ...collection.slice(index + 1, collection.length)
  ]
}

/**
 * Replace an attribute in the StartTag and return a new StartTag
 */
function replaceAttribute(token: StartTag, prev: Attribute, next: Attribute): StartTag {
  const index = token.attributes.indexOf(prev);

  return {
    ...token,
    attributes: replaceItem(token.attributes, prev, next)
  }
}

function appendAttribute(token: StartTag, next: Attribute): StartTag {
  return {
    ...token,
    attributes: [
      ...token.attributes,
      next
    ]
  };
}

function createBlockParameter(token: StartTag, parameter: string): StartTag {
  return {
    ...token,
    hasBlock: true,
    blockParameters: [
      ...token.blockParameters,
      parameter
    ]
  };
}

function replaceBlockParameter(token: StartTag, prev: string, next: string): StartTag {
  const index = token.blockParameters.indexOf(prev);

  return {
    ...token,
    blockParameters: replaceItem(token.blockParameters, prev, next)
  }
}

export interface Attribute {
  type: 'json' | 'expression';
  name: string;
  value: string; // TODO handle more types?
}

export function jsonAttr(name: string, value: string = ''): Attribute {
  return {
    type: 'json',
    name,
    value
  };
}

export function expressionAttr(name: string, value: string = ''): Attribute {
  return {
    type: 'expression',
    name,
    value
  }
}

export interface World {
  buffer: string;
  state: TokenizerState;
  currentToken: Token | null;
  currentAttribute: Attribute | null;
  tokens: Token[];
}

export function getTokens(source: string): Token[] {
  const world = source.split('').reduce((world: World, char: string) => {
    return getNextToken(world, char);
  }, initWorld())

  return getNextToken(world, EOF_CHARACTER).tokens;
}

export function initWorld(): World {
  return {
    buffer: '',
    state: 'data',
    currentToken: null,
    currentAttribute: null,
    tokens: []
  }
}

export interface StartTag {
  type: 'start-tag';
  tagName: string;
  selfClosing: boolean;
  hasBlock: boolean;
  attributes: Attribute[];
  blockParameters: string[];
}

export interface EndTag {
  type: 'end-tag';
  tagName: string;
}

export interface Expression {
  type: 'expression';
  value: string;
}

/**
 * Comments
 */
export interface Comment {
  type: 'comment';
  data: string;
}

export type CommentState =
  'comment-start'
  | 'comment-start-dash'
  | 'comment-end-dash'
  | 'comment'
  | 'comment-end'

export interface CreateComment {
  type: 'create-comment'
}

export interface AppendComment {
  type: 'append-comment';
  payload: string;
}

export interface EmitComment {
  type: 'emit-comment';
}

export type CommentAction =
  CreateComment
  | AppendComment
  | EmitComment;

export interface Character {
  type: 'character';
  data: string;
}

export interface EOF {
  type: 'eof';
}

export type TagToken = StartTag | EndTag;

export type Token = TagToken
  | Comment
  | Character
  | Expression
  | EOF;

export type TokenizerState =
  'data'
  | 'expression'
  | 'tag-open'
  | 'markup-declaration-open'
  | 'end-tag-open'
  | 'tag-name'
  | 'before-attribute-name'
  | 'attribute-name'
  | 'after-attribute-name'
  | 'before-attribute-value'
  | 'attribute-value-string'
  | 'attribute-value-number'
  | 'attribute-value-array'
  | 'attribute-value-object-or-expression'
  | 'attribute-value-object'
  | 'attribute-value-expression'
  | 'after-attribute-value'
  | 'self-closing-start-tag'
  | 'before-block'
  | 'before-block-parameter'
  | 'block-parameter'
  | CommentState;

interface EmitCharacter {
  type: 'emit-character';
  payload: string;
};

interface EmitEOF {
  type: 'emit-eof';
}

interface EmitCurrentToken {
  type: 'emit-current-token';
}

interface SetSelfClosing {
  type: 'set-self-closing';
}

interface TransitionAction {
  type: 'transition';
  payload: TokenizerState;
}

interface CreateStartTagToken {
  type: 'create-start-tag';
  payload: string;
}

interface CreateExpression {
  type: 'create-expression';
}

interface CreateEndTagToken {
  type: 'create-end-tag';
  payload: string;
}

interface CreateAttribute {
  type: 'create-attribute';
  payload: string;
}

interface CreateBlockParameter {
  type: 'create-block-parameter';
  payload: string;
}

interface AppendTagName {
  type: 'append-tag-name';
  payload: string;
}

interface AppendExpression {
  type: 'append-expression';
  payload: string;
}

interface AppendBlockParameter {
  type: 'append-block-parameter';
  payload: string;
}

interface AppendAttributeName {
  type: 'append-attribute-name';
  payload: string;
}

interface AppendAttributeValue {
  type: 'append-attribute-value';
  payload: string;
}

interface AppendBuffer {
  type: 'append-buffer';
  payload: string;
}

interface ClearBuffer {
  type: 'clear-buffer';
}

interface ChangeAttrToExpression {
  type: 'change-attr-to-expression';
}

export interface OtherAction {
  type: '';
}

function createTransition(payload: TokenizerState): TransitionAction {
  return { type: 'transition', payload };
}

type Action = TransitionAction
  | CreateStartTagToken
  | CreateExpression
  | CreateEndTagToken
  | CreateAttribute
  | CreateBlockParameter
  | AppendTagName
  | AppendExpression
  | AppendBuffer
  | ClearBuffer
  | EmitCharacter
  | EmitEOF
  | EmitCurrentToken
  | CommentAction
  | SetSelfClosing
  | AppendAttributeName
  | AppendAttributeValue
  | AppendBlockParameter
  | ChangeAttrToExpression
  | OtherAction;

export function getNextToken(world: World, char: string): World {
  return getActions(char, world).reduce(mutateWorld, world);
}

function getActions(char: string, world: World): Action[] {
  switch (world.state) {
    case 'data':
      return handleData(char);
    case 'expression':
      return handleExpression(char);
    case 'tag-open':
      return handleTagOpen(char);
    case 'tag-name':
      return handleTagName(char);
    case 'end-tag-open':
      return handleEndTagOpen(char);
    case 'self-closing-start-tag':
      return handleSelfClosingStartTag(char);
    case 'before-attribute-name':
      return handleBeforeAttributeName(char);
    case 'attribute-name':
      return handleAttributeName(char);
    case 'after-attribute-name':
      return handleAfterAttributeName(char);
    case 'before-attribute-value':
      return handleBeforeAttributeValue(char);
    case 'attribute-value-string':
      return handleAttributeValueString(char);
    case 'attribute-value-number':
      return handleAttributeValueNumber(char);
    case 'attribute-value-array':
      return handleAttributeValueArray(char, world);
    case 'attribute-value-object-or-expression':
      return handleAttributeValueObjectOrExpression(char);
    case 'attribute-value-object':
      return handleAttributeValueObject(char, world);
    case 'attribute-value-expression':
      return handleAttributeValueExpression(char);
    case 'after-attribute-value':
      return handleAfterAttributeValue(char);
    case 'markup-declaration-open':
      return handleMarkupDeclarationOpen(char, world);
    case 'comment-start':
      return handleCommentStart(char);
    case 'comment':
      return handleComment(char);
    case 'comment-start-dash':
      return handleCommentStartDash(char);
    case 'comment-end-dash':
      return handleCommentEndDash(char);
    case 'comment-end':
      return handleCommentEnd(char);
    case 'before-block':
      return handleBeforeBlock(char);
    case 'before-block-parameter':
      return handleBeforeBlockParameter(char);
    case 'block-parameter':
      return handleBlockParameter(char);
    default:
      throw new SyntaxError('unknown state');
  }
}

function mutateWorld(world: World, action: Action): World {
  switch (action.type) {
    case 'emit-character':
      return {
        ...world,
        tokens: [
          ...world.tokens,
          character(action.payload)
        ]
      }
    case 'emit-eof':
      return {
        ...world,
        tokens: [
          ...world.tokens,
          EOF()
        ]
      }
    case 'transition':
      return {
        ...world,
        state: action.payload
      }
    case 'create-start-tag':
      return {
        ...world,
        currentToken: startTag(action.payload)
      }
    case 'create-expression':
      return {
        ...world,
        currentToken: expression('')
      };
    case 'create-end-tag':
      return {
        ...world,
        currentToken: endTag(action.payload)
      }
    case 'create-attribute':
      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes');
      }

      const newAttribute: Attribute = jsonAttr(action.payload);

      return {
        ...world,
        currentToken: appendAttribute(world.currentToken, newAttribute),
        currentAttribute: newAttribute
      }
    case 'create-block-parameter':
      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('current token is not start tag');
      }

      return {
        ...world,
        currentToken: createBlockParameter(world.currentToken, action.payload)
      };
    case 'create-comment':
      return {
        ...world,
        currentToken: comment(),
      }
    case 'append-tag-name':
      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (!isTagToken(world.currentToken)) {
        throw new SyntaxError('only start-tag and end-tag have tagName');
      }

      return {
        ...world,
        currentToken: {
          ...world.currentToken,
          tagName: `${world.currentToken.tagName}${action.payload}`
        }
      }
    case 'append-expression':
      if (!world.currentToken) {
        throw SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'expression') {
        throw new SyntaxError('current token is not an expression');
      }

      return {
        ...world,
        currentToken: expression(`${world.currentToken.value}${action.payload}`)
      };
    case 'append-buffer':
      return {
        ...world,
        buffer: `${world.buffer}${action.payload}`,
      }
    case 'append-comment':
      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'comment') {
        throw new Error('current token is not comment');
      }

      return {
        ...world,
        currentToken: comment(`${world.currentToken.data}${action.payload}`)
      };
    case 'clear-buffer':
      return {
        ...world,
        buffer: ''
      }
    case 'emit-current-token':
      if (!world.currentToken) {
        throw new SyntaxError('no tag token to emit');
      }

      return {
        ...world,
        currentToken: null,
        currentAttribute: null,
        tokens: [
          ...world.tokens,
          world.currentToken
        ]
      }
    case 'emit-comment':
      if (!world.currentToken) {
        throw new Error('no current token');
      }

      if (world.currentToken.type !== 'comment') {
        throw new Error('current token is not comment');
      }

      return {
        ...world,
        currentToken: null,
        tokens: [
          ...world.tokens,
          world.currentToken
        ]
      }
    case 'set-self-closing':
      if (!world.currentToken) {
        throw new Error('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new Error('only start-tag can be made self closing');
      }

      return {
        ...world,
        currentToken: {
          ...world.currentToken,
          selfClosing: true
        }
      }
    case 'append-attribute-name': {
      if (!world.currentAttribute) {
        throw new SyntaxError('no current attribute');
      }

      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes');
      }

      const prev = world.currentAttribute;

      const next = {
        ...prev,
        name: `${prev.name}${action.payload}`
      };

      return {
        ...world,
        currentAttribute: next,
        currentToken: replaceAttribute(world.currentToken, prev, next)
      }
    }
    case 'append-attribute-value': {
      if (!world.currentAttribute) {
        throw new SyntaxError('no current attribute');
      }

      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes');
      }

      const prev = world.currentAttribute;

      const next = {
        ...prev,
        value: `${prev.value}${action.payload}`
      };

      return {
        ...world,
        currentAttribute: next,
        currentToken: replaceAttribute(world.currentToken, prev, next)
      }
    }
    case 'append-block-parameter':
      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('current token is not start tag');
      }

      const prev = world.currentToken.blockParameters[world.currentToken.blockParameters.length - 1];
      const next = `${prev}${action.payload}`;

      return {
        ...world,
        currentToken: replaceBlockParameter(world.currentToken, prev, next)
      };
    case 'change-attr-to-expression': {
      if (!world.currentAttribute) {
        throw new SyntaxError('no current attribute');
      }

      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes');
      }

      const prev = world.currentAttribute;

      const next: Attribute = {
        ...prev,
        type: 'expression'
      };

      return {
        ...world,
        currentAttribute: next,
        currentToken: replaceAttribute(world.currentToken, prev, next)
      }
    }
    default:
      throw new SyntaxError('unknown action');
  }
}

function isTagToken(token: Token): token is TagToken {
  return (token.type === 'start-tag' || token.type === 'end-tag');
}

export function character(data: string): Character {
  return {
    type: 'character',
    data
  };
}

export function spaces(count: number): Character[] {
  const chars = [];

  for (let i = 0; i < count; i++) {
    chars.push(character(' '));
  }

  return chars;
}

export function word(word: string): Character[] {
  return word.split('').map(char => character(char))
}

export function EOF(): EOF {
  return { type: 'eof' };
}

export function startTag(tagName: string, attributes: Attribute[] = [], selfClosing: boolean = false, blockParameters: string[] = []): StartTag {
  const hasBlock = (blockParameters.length) ? true : false;

  return {
    type: 'start-tag',
    tagName,
    selfClosing,
    hasBlock,
    attributes,
    blockParameters
  };
}

export function expression(value: string): Expression {
  return {
    type: 'expression',
    value
  };
}

export function endTag(tagName: string): EndTag {
  return {
    type: 'end-tag',
    tagName
  };
}

export function comment(data: string = ''): Comment {
  return {
    type: 'comment',
    data
  }
}

function handleData(char: string): Action[] {
  switch (char) {
    case '<':
      return [createTransition('tag-open')]
    case '{':
      return [
        createTransition('expression'),
        { type: 'create-expression' }
      ]
    case EOF_CHARACTER:
      return [{ type: 'emit-eof' }];
    default:
      return [{ type: 'emit-character', payload: char }];
  }
}

function handleExpression(char: string): Action[] {
  handleEOF(char);

  if (char === '}') {
    return [
      { type: 'emit-current-token' },
      createTransition('data')
    ];
  } else {
    return [
      { type: 'append-expression', payload: char }
    ];
  }
}

function handleEOF(char: string): void {
  if (char === EOF_CHARACTER) {
    throw unexpectedEndOfFile();
  }
}

function handleTagOpen(char: string): Action[] {
  handleEOF(char);

  if (char === '/') {
    return [
      createTransition('end-tag-open')
    ]
  } else if (char === '!') {
    return [
      createTransition('markup-declaration-open')
    ]
  } else if (char.match(ASCII)) {
    return [
      { type: 'create-start-tag', payload: char.toLowerCase() },
      createTransition('tag-name')
    ];
  } else {
    throw new SyntaxError('unknown character');
  }
}

function handleTagName(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [
      createTransition('before-attribute-name')
    ]
  } else if (char === '/') {
    return [
      createTransition('self-closing-start-tag')
    ];
  } else if (char === '>') {
    return [
      createTransition('data'),
      { type: 'emit-current-token' }
    ];

  } else {
    return [
      { type: 'append-tag-name', payload: char.toLowerCase() }
    ];
  }
}

function handleEndTagOpen(char: string): Action[] {
  handleEOF(char);

  if (char.match(ASCII)) {
    return [
      { type: 'create-end-tag', payload: char.toLowerCase() },
      createTransition('tag-name')
    ]
  } else {
    throw unknownCharacter();
  }
}

function handleSelfClosingStartTag(char: string): Action[] {
  handleEOF(char);

  if (char === '>') {
    return [
      { type: 'set-self-closing' },
      createTransition('data'),
      { type: 'emit-current-token' }
    ]
  } else {
    throw unknownCharacter();
  }
}

function handleBeforeAttributeName(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [];
  } else if (char === '/') {
    return [
      createTransition('self-closing-start-tag')
    ];
  } else if (char === '>') {
    return [
      { type: 'emit-current-token' },
      createTransition('data')
    ];
  } else if (char === '=') {
    return [
      createTransition('before-block')
    ];
  } else if ([`"`, `'`, '<'].indexOf(char) !== -1) {
    throw unknownCharacter();
  } else {
    return [
      { type: 'create-attribute', payload: char.toLowerCase() },
      createTransition('attribute-name')
    ]
  }
}

function handleAttributeName(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [
      createTransition('after-attribute-name')
    ];
  } else if (char === '/') {
    return [
      createTransition('self-closing-start-tag')
    ];
  } else if (char === '=') {
    return [
      createTransition('before-attribute-value')
    ];
  } else if (char === '>') {
    return [
      { type: 'emit-current-token' },
      createTransition('data')
    ];
  } else if ([`'`, `"`, `<`].indexOf(char) !== -1) {
    throw unknownCharacter();
  } else {
    return [
      { type: 'append-attribute-name', payload: char.toLowerCase() }
    ];
  }
}

function handleAfterAttributeName(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return []; // ignore whitespace
  } else if (char === '/') {
    return [
      createTransition('self-closing-start-tag')
    ];
  } else if (char === '=') {
    return [
      createTransition('before-attribute-value')
    ];
  } else if (char === '>') {
    return [
      { type: 'emit-current-token' },
      createTransition('data')
    ];
  } else if ([`'`, `"`, `<`].indexOf(char) !== -1) {
    throw unknownCharacter();
  } else {
    return [
      { type: 'create-attribute', payload: char.toLowerCase() },
      createTransition('attribute-name')
    ];
  }
}

function handleBeforeAttributeValue(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [];
  } else if (char === '"') {
    return [
      { type: 'append-attribute-value', payload: char },
      createTransition('attribute-value-string')
    ];
  } else if (char.match(DIGIT)) {
    return [
      { type: 'append-attribute-value', payload: char },
      createTransition('attribute-value-number')
    ];
  } else if (char === '[') {
    return [
      { type: 'append-attribute-value', payload: char },
      createTransition('attribute-value-array')
    ];
  } else if (char === '{') {
    return [
      createTransition('attribute-value-object-or-expression')
    ];
  } else {
    throw unknownCharacter();
  }
}

function handleAttributeValueString(char: string): Action[] {
  handleEOF(char);

  if (char === `"`) {
    return [
      { type: 'append-attribute-value', payload: char },
      createTransition('after-attribute-value')
    ];
  } else {
    return [
      { type: 'append-attribute-value', payload: char }
    ]
  }
}

function handleAttributeValueNumber(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [
      createTransition('before-attribute-name')
    ]
  } else if (char === '/') {
    return [
      createTransition('self-closing-start-tag')
    ];
  } else if (char === '>') {
    return [
      { type: 'emit-current-token' },
      createTransition('data')
    ];
  } else if (char.match(DIGIT)) {
    return [
      { type: 'append-attribute-value', payload: char }
    ];
  } else {
    throw unknownCharacter();
  }
}


function handleAttributeValueArray(char: string, world: World): Action[] {
  handleEOF(char);

  if (char === ']') {
    if (world.currentAttribute) {
      try {
        JSON.parse(`${world.currentAttribute.value}${char}`)

        // parsable by json so switch to after-attribute-value
        return [
          { type: 'append-attribute-value', payload: char },
          createTransition('after-attribute-value')
        ]
      } catch (e) {
        // not parsable, just append value
        return [
          { type: 'append-attribute-value', payload: char },
        ]
      }
    } else {
      throw new Error('no current attribute');
    }
  } else {
    return [
      { type: 'append-attribute-value', payload: char }
    ]
  }
}

function handleAttributeValueObjectOrExpression(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [];
  } else if (char === '"') {
    return [
      { type: 'append-attribute-value', payload: "{" },
      { type: 'append-attribute-value', payload: char },
      createTransition('attribute-value-object')
    ];
  } else {
    return [
      { type: 'append-attribute-value', payload: char },
      { type: 'change-attr-to-expression' },
      createTransition('attribute-value-expression')
    ];
  }
}

function handleAttributeValueObject(char: string, world: World): Action[] {
  handleEOF(char);

  if (char === '}') {
    if (world.currentAttribute) {
      try {
        JSON.parse(`${world.currentAttribute.value}${char}`)

        // parsable by json so switch to after-attribute-value
        return [
          { type: 'append-attribute-value', payload: char },
          createTransition('after-attribute-value')
        ]
      } catch (e) {
        // not parsable, just append value
        return [
          { type: 'append-attribute-value', payload: char },
        ]
      }
    } else {
      throw new Error('no current attribute');
    }
  } else {
    return [
      { type: 'append-attribute-value', payload: char }
    ]
  }
}

function handleAttributeValueExpression(char: string): Action[] {
  handleEOF(char);

  if (char === '}') {
    return [
      createTransition('after-attribute-value')
    ];
  } else {
    return [
      { type: 'append-attribute-value', payload: char }
    ];
  }
}

function handleAfterAttributeValue(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [
      createTransition('before-attribute-name')
    ];
  } else if (char === '/') {
    return [
      createTransition('self-closing-start-tag')
    ];
  } else if (char === '>') {
    return [
      { type: 'emit-current-token' },
      createTransition('data')
    ];
  } else {
    throw unknownCharacter();
  }
}

function handleMarkupDeclarationOpen(char: string, world: World): Action[] {
  handleEOF(char);

  if (char === '-') {
    if (world.buffer === '-') {
      return [
        { type: 'clear-buffer' },
        { type: 'create-comment' },
        createTransition('comment-start')
      ];
    } else {
      return [
        { type: 'append-buffer', payload: char }
      ]
    }
  } else {
    throw unknownCharacter();
  }
}

function handleCommentStart(char: string): Action[] {
  handleEOF(char);

  if (char === '-') {
    return [
      createTransition('comment-start-dash')
    ]
  } else if (char === '>') {
    throw unknownCharacter();
  } else {
    return [
      createTransition('comment'),
      { type: 'append-comment', payload: char }
    ];
  }
}

function handleComment(char: string): Action[] {
  handleEOF(char);

  if (char === '-') {
    return [
      createTransition('comment-end-dash')
    ];
  } else {
    return [
      { type: 'append-comment', payload: char }
    ]
  }
}

function handleCommentStartDash(char: string): Action[] {
  handleEOF(char);

  if (char === '-') {
    return [
      createTransition('comment-end')
    ]
  } else if (char === '>') {
    throw unknownCharacter();
  } else {
    return [
      { type: 'append-comment', payload: '-' },
      { type: 'append-comment', payload: char },
      createTransition('comment')
    ]
  }
}

function handleCommentEndDash(char: string): Action[] {
  handleEOF(char);

  if (char === '-') {
    return [
      createTransition('comment-end')
    ]
  } else {
    return [
      { type: 'append-comment', payload: '-' },
      { type: 'append-comment', payload: char },
      createTransition('comment')
    ];
  }
}

function handleCommentEnd(char: string): Action[] {
  handleEOF(char);

  if (char === '>') {
    return [
      { type: 'emit-comment' },
      createTransition('data')
    ]
  } else if (char === '-') {
    return [
      { type: 'append-comment', payload: char }
    ];
  } else {
    return [
      { type: 'append-comment', payload: '-' },
      { type: 'append-comment', payload: '-' },
      { type: 'append-comment', payload: char },
      createTransition('comment')
    ];
  }
}

function handleBeforeBlock(char: string): Action[] {
  handleEOF(char);

  if (char === '>') {
    return [
      createTransition('before-block-parameter')
    ];
  } else {
    throw unknownCharacter();
  }
}

function handleBeforeBlockParameter(char: string): Action[] {
  handleEOF(char);

  if (char.match(WHITESPACE)) {
    return [];
  } else if (char.match(ASCII)) {
    return [
      { type: 'create-block-parameter', payload: char },
      createTransition('block-parameter')
    ];
  } else {
    throw unknownCharacter();
  }
}

function handleBlockParameter(char: string): Action[] {
  handleEOF(char);

  if (char.match(ASCII)) {
    return [
      { type: 'append-block-parameter', payload: char }
    ]
  } else if (char === ',') {
    return [
      createTransition('before-block-parameter')
    ];
  } else if (char === '>') {
    return [
      createTransition('data'),
      { type: 'emit-current-token' }
    ]
  } else {
    throw unknownCharacter();
  }
}

function unknownCharacter(): SyntaxError {
  return new SyntaxError('unknown character');
}

function unexpectedEndOfFile(): SyntaxError {
  return new SyntaxError('unexpected end of file');
}