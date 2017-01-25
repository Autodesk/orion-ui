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

export interface Location {
  start: {
    line: number;
    column: number;
  };

  end: {
    line: number;
    column: number;
  }
}

export interface World {
  buffer: string;
  state: TokenizerState;
  currentToken: Token | null;
  currentAttribute: Attribute | null;
  currentLine: number;
  currentColumn: number;
  tokens: Token[];
}

export function getTokens(source: string): Token[] {
  const world = source
    .split('')
    .reduce((world: World, char: string) =>
      getNextLocation(getNextToken(world, char), char), initWorld())

  return getNextToken(world, EOF_CHARACTER).tokens;
}

export function initWorld(): World {
  return {
    buffer: '',
    state: 'data',
    currentToken: null,
    currentAttribute: null,
    currentLine: 1,
    currentColumn: 1,
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
  location: Location;
}

export interface EndTag {
  type: 'end-tag';
  tagName: string;
  location: Location;
}

export interface Expression {
  type: 'expression';
  value: string;
  location: Location;
}

function isExpression(token: Token): token is Expression {
  return token.type === 'expression';
}

/**
 * Comments
 */
export interface Comment {
  type: 'comment';
  data: string;
  location: Location;
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
  location: Location;
  data: string;
}

export interface EOF {
  type: 'eof';
  location: Location;
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

export function getNextLocation(world: World, char: string): World {
  if (char === '\n') {
    return {
      ...world,
      currentLine: world.currentLine + 1,
      currentColumn: 1
    }
  } else {
    return {
      ...world,
      currentColumn: world.currentColumn + 1
    }
  }
}

function getActions(char: string, world: World): Action[] {
  switch (world.state) {
    case 'data':
      return handleData(char);
    case 'expression':
      return handleExpression(char, world);
    case 'tag-open':
      return handleTagOpen(char, world);
    case 'tag-name':
      return handleTagName(char, world);
    case 'end-tag-open':
      return handleEndTagOpen(char, world);
    case 'self-closing-start-tag':
      return handleSelfClosingStartTag(char, world);
    case 'before-attribute-name':
      return handleBeforeAttributeName(char, world);
    case 'attribute-name':
      return handleAttributeName(char, world);
    case 'after-attribute-name':
      return handleAfterAttributeName(char, world);
    case 'before-attribute-value':
      return handleBeforeAttributeValue(char, world);
    case 'attribute-value-string':
      return handleAttributeValueString(char, world);
    case 'attribute-value-number':
      return handleAttributeValueNumber(char, world);
    case 'attribute-value-array':
      return handleAttributeValueArray(char, world);
    case 'attribute-value-object-or-expression':
      return handleAttributeValueObjectOrExpression(char, world);
    case 'attribute-value-object':
      return handleAttributeValueObject(char, world);
    case 'attribute-value-expression':
      return handleAttributeValueExpression(char, world);
    case 'after-attribute-value':
      return handleAfterAttributeValue(char, world);
    case 'markup-declaration-open':
      return handleMarkupDeclarationOpen(char, world);
    case 'comment-start':
      return handleCommentStart(char, world);
    case 'comment':
      return handleComment(char, world);
    case 'comment-start-dash':
      return handleCommentStartDash(char, world);
    case 'comment-end-dash':
      return handleCommentEndDash(char, world);
    case 'comment-end':
      return handleCommentEnd(char, world);
    case 'before-block':
      return handleBeforeBlock(char, world);
    case 'before-block-parameter':
      return handleBeforeBlockParameter(char, world);
    case 'block-parameter':
      return handleBlockParameter(char, world);
    default:
      throw new SyntaxError('unknown state', world);
  }
}

function mutateWorld(world: World, action: Action): World {
  switch (action.type) {
    case 'emit-character':
      return {
        ...world,
        tokens: [
          ...world.tokens,
          character(action.payload, world.currentLine, world.currentColumn)
        ]
      }
    case 'emit-eof':
      return {
        ...world,
        tokens: [
          ...world.tokens,
          EOF(world.currentLine, world.currentColumn)
        ]
      }
    case 'transition':
      return {
        ...world,
        state: action.payload
      }
    case 'create-start-tag': {
      // Prefix is <
      const START_TAG_PREFIX_LENGTH = 1;
      const startColumn = world.currentColumn - START_TAG_PREFIX_LENGTH;

      return {
        ...world,
        currentToken: startTag(action.payload, {
          location: {
            start: { line: world.currentLine, column: startColumn },
            end: { line: 1, column: 1 }
          }
        })
      }
    }
    case 'create-expression':
      return {
        ...world,
        currentToken: expression('', world.currentLine, world.currentColumn)
      };
    case 'create-end-tag': {
      // Prefix is </
      const END_TAG_PREFIX_LENGTH = 2;
      const startColumn = world.currentColumn - END_TAG_PREFIX_LENGTH;

      return {
        ...world,
        currentToken: endTag(action.payload, {
          start: { line: world.currentLine, column: startColumn },
          end: { line: 1, column: 1 }
        })
      }
    }
    case 'create-attribute':
      if (!world.currentToken) {
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes', world);
      }

      const newAttribute: Attribute = jsonAttr(action.payload);

      return {
        ...world,
        currentToken: appendAttribute(world.currentToken, newAttribute),
        currentAttribute: newAttribute
      }
    case 'create-block-parameter':
      if (!world.currentToken) {
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('current token is not start tag', world);
      }

      return {
        ...world,
        currentToken: createBlockParameter(world.currentToken, action.payload)
      };
    case 'create-comment':
      // Prefix is <!-- (minus the current dash)
      const COMMENT_PREFIX_LENGTH = 3;
      const startColumn = world.currentColumn - COMMENT_PREFIX_LENGTH;

      return {
        ...world,
        currentToken: comment('', world.currentLine, startColumn),
      }
    case 'append-tag-name':
      if (!world.currentToken) {
        throw new SyntaxError('no current token', world);
      }

      if (!isTagToken(world.currentToken)) {
        throw new SyntaxError('only start-tag and end-tag have tagName', world);
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
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'expression') {
        throw new SyntaxError('current token is not an expression', world);
      }

      return {
        ...world,
        currentToken: {
          ...world.currentToken,
          value: `${world.currentToken.value}${action.payload}`
        }
      };
    case 'append-buffer':
      return {
        ...world,
        buffer: `${world.buffer}${action.payload}`,
      }
    case 'append-comment':
      if (!world.currentToken) {
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'comment') {
        throw new Error('current token is not comment');
      }

      return {
        ...world,
        currentToken: {
          ...world.currentToken,
          data: `${world.currentToken.data}${action.payload}`
        }
      };
    case 'clear-buffer':
      return {
        ...world,
        buffer: ''
      }
    case 'emit-current-token':
      if (!world.currentToken) {
        throw new SyntaxError('no tag token to emit', world);
      }

      // Add end location to new token
      const newToken = {
        ...world.currentToken,
        location: {
          ...world.currentToken.location,
          end: {
            line: world.currentLine,
            column: world.currentColumn
          }
        }
      };

      return {
        ...world,
        currentToken: null,
        currentAttribute: null,
        tokens: [
          ...world.tokens,
          newToken
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
          {
            ...world.currentToken,
            location: {
              ...world.currentToken.location,
              end: {
                line: world.currentLine,
                column: world.currentColumn
              }
            }
          }
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
        throw new SyntaxError('no current attribute', world);
      }

      if (!world.currentToken) {
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes', world);
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
        throw new SyntaxError('no current attribute', world);
      }

      if (!world.currentToken) {
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes', world);
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
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('current token is not start tag', world);
      }

      const prev = world.currentToken.blockParameters[world.currentToken.blockParameters.length - 1];
      const next = `${prev}${action.payload}`;

      return {
        ...world,
        currentToken: replaceBlockParameter(world.currentToken, prev, next)
      };
    case 'change-attr-to-expression': {
      if (!world.currentAttribute) {
        throw new SyntaxError('no current attribute', world);
      }

      if (!world.currentToken) {
        throw new SyntaxError('no current token', world);
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes', world);
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
      throw new SyntaxError('unknown action', world);
  }
}

function isTagToken(token: Token): token is TagToken {
  return (token.type === 'start-tag' || token.type === 'end-tag');
}

function isStartTag(token: Token): token is StartTag {
  return token.type === 'start-tag';
}

function isEndTag(token: Token): token is EndTag {
  return token.type === 'end-tag';
}

export function character(data: string, line: number = 1, column: number = 1): Character {
  const lc = { line, column };

  return {
    type: 'character',
    data,
    location: {
      start: lc,
      end: lc
    }
  };
}

export function spaces(count: number, startLine: number = 1, startColumn: number = 1): Character[] {
  const chars = [];

  for (let i = 0; i < count; i++) {
    chars.push(character(' ', startLine, startColumn + i));
  }

  return chars;
}

export function word(word: string): Character[] {
  return word.split('').map(char => character(char))
}

export function EOF(line: number = 1, column: number = 1): EOF {
  return {
    type: 'eof', location: {
      start: { line, column },
      end: { line, column }
    }
  };
}

export interface StartTagOptions {
  attributes: Attribute[];
  selfClosing: boolean;
  blockParameters: string[];
  location: Location;
}

export function startTag(tagName: string, options: Partial<StartTagOptions> = {}): StartTag {
  // Set up the defaults
  const {
    attributes,
    selfClosing,
    blockParameters,
    location
  }: StartTagOptions = {
      attributes: [],
      selfClosing: false,
      blockParameters: [],
      location: {
        start: { line: 1, column: 1 },
        end: { line: 1, column: 1 },
      },

      // User can overwrite
      ...options
    }

  const hasBlock = (blockParameters.length) ? true : false;

  return {
    type: 'start-tag',
    tagName,
    selfClosing,
    hasBlock,
    attributes,
    blockParameters,
    location
  };
}

export function expression(value: string,
  startLine: number = 1, startColumn: number = 1,
  endLine: number = 1, endColumn: number = 1): Expression {
  return {
    type: 'expression',
    value,
    location: {
      start: { line: startLine, column: startColumn },
      end: { line: endLine, column: endColumn }
    }
  };
}

export function endTag(tagName: string, location: Location = {
  start: { line: 1, column: 1 },
  end: { line: 1, column: 1 }
}): EndTag {
  return {
    type: 'end-tag',
    tagName,
    location
  };
}

export function comment(data: string = '',
  startLine: number = 1, startColumn: number = 1,
  endLine: number = 1, endColumn: number = 1): Comment {
  return {
    type: 'comment',
    data,
    location: {
      start: { line: startLine, column: startColumn },
      end: { line: endLine, column: endColumn }
    }
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

function handleExpression(char: string, world: World): Action[] {
  handleEOF(char, world);

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

function handleEOF(char: string, world: World): void {
  if (char === EOF_CHARACTER) {
    throw unexpectedEndOfFile(world);
  }
}

function handleTagOpen(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw new SyntaxError('unknown character', world);
  }
}

function handleTagName(char: string, world: World): Action[] {
  handleEOF(char, world);

  if (char.match(WHITESPACE)) {
    // Guard whitespace in tagname for end tags
    if (world.currentToken && isEndTag(world.currentToken)) {
      throw new SyntaxError(`Expected '>'`, world);
    }

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

function handleEndTagOpen(char: string, world: World): Action[] {
  handleEOF(char, world);

  if (char.match(ASCII)) {
    return [
      { type: 'create-end-tag', payload: char.toLowerCase() },
      createTransition('tag-name')
    ]
  } else {
    throw unknownCharacter(world);
  }
}

function handleSelfClosingStartTag(char: string, world: World): Action[] {
  handleEOF(char, world);

  if (char === '>') {
    return [
      { type: 'set-self-closing' },
      createTransition('data'),
      { type: 'emit-current-token' }
    ]
  } else {
    throw unknownCharacter(world);
  }
}

function handleBeforeAttributeName(char: string, world: World): Action[] {
  handleEOF(char, world );

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
    throw unknownCharacter(world);
  } else {
    return [
      { type: 'create-attribute', payload: char.toLowerCase() },
      createTransition('attribute-name')
    ]
  }
}

function handleAttributeName(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw unknownCharacter(world);
  } else {
    return [
      { type: 'append-attribute-name', payload: char.toLowerCase() }
    ];
  }
}

function handleAfterAttributeName(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw unknownCharacter(world);
  } else {
    return [
      { type: 'create-attribute', payload: char.toLowerCase() },
      createTransition('attribute-name')
    ];
  }
}

function handleBeforeAttributeValue(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw unknownCharacter(world);
  }
}

function handleAttributeValueString(char: string, world: World): Action[] {
  handleEOF(char, world);

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

function handleAttributeValueNumber(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw unknownCharacter(world);
  }
}


function handleAttributeValueArray(char: string, world: World): Action[] {
  handleEOF(char, world);

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

function handleAttributeValueObjectOrExpression(char: string, world: World): Action[] {
  handleEOF(char, world);

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
  handleEOF(char, world);

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

function handleAttributeValueExpression(char: string, world: World): Action[] {
  handleEOF(char, world);

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

function handleAfterAttributeValue(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw unknownCharacter(world);
  }
}

function handleMarkupDeclarationOpen(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw unknownCharacter(world);
  }
}

function handleCommentStart(char: string, world: World): Action[] {
  handleEOF(char, world);

  if (char === '-') {
    return [
      createTransition('comment-start-dash')
    ]
  } else if (char === '>') {
    throw unknownCharacter(world);
  } else {
    return [
      createTransition('comment'),
      { type: 'append-comment', payload: char }
    ];
  }
}

function handleComment(char: string, world: World): Action[] {
  handleEOF(char, world);

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

function handleCommentStartDash(char: string, world: World): Action[] {
  handleEOF(char, world);

  if (char === '-') {
    return [
      createTransition('comment-end')
    ]
  } else if (char === '>') {
    throw unknownCharacter(world);
  } else {
    return [
      { type: 'append-comment', payload: '-' },
      { type: 'append-comment', payload: char },
      createTransition('comment')
    ]
  }
}

function handleCommentEndDash(char: string, world: World): Action[] {
  handleEOF(char, world);

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

function handleCommentEnd(char: string, world: World): Action[] {
  handleEOF(char, world);

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

function handleBeforeBlock(char: string, world: World): Action[] {
  handleEOF(char, world);

  if (char === '>') {
    return [
      createTransition('before-block-parameter')
    ];
  } else {
    throw unknownCharacter(world);
  }
}

function handleBeforeBlockParameter(char: string, world: World): Action[] {
  handleEOF(char, world);

  if (char.match(WHITESPACE)) {
    return [];
  } else if (char.match(ASCII)) {
    return [
      { type: 'create-block-parameter', payload: char },
      createTransition('block-parameter')
    ];
  } else {
    throw unknownCharacter(world);
  }
}

function handleBlockParameter(char: string, world: World): Action[] {
  handleEOF(char, world);

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
    throw unknownCharacter(world);
  }
}

function unknownCharacter(world: World): SyntaxError {
  return new SyntaxError('unknown character', world);
}

function unexpectedEndOfFile(world: World): SyntaxError {
  return new SyntaxError('unexpected end of file', world);
}

export class SyntaxError {
  public message: string;
  public location: { line: number, column: number };

  constructor(message: string, world: World) {
    this.message = message;
    this.location = { line: world.currentLine, column: world.currentColumn };
  }
}