import { WHITESPACE } from './parser';

const ASCII = /[a-zA-Z]/;

export interface Attribute {
  name: string;
  value: string; // TODO handle more types?
}

export interface World {
  buffer: string;
  state: TokenizerState;
  currentToken: Token | null;
  currentAttribute: Attribute | null;
  tokens: Token[];
}

export function getTokens(source: string): Token[] {
  return source.split('').reduce((world: World, char: string) => {
    return getNextToken(world, char);
  }, initWorld()).tokens;
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
  attributes: Attribute[];
}

export interface EndTag {
  type: 'end-tag';
  tagName: string;
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
  | EOF;

export type TokenizerState =
  'data'
  | 'tag-open'
  | 'markup-declaration-open'
  | 'end-tag-open'
  | 'tag-name'
  | 'before-attribute-name'
  | 'attribute-name'
  | 'after-attribute-name'
  | 'before-attribute-value'
  | 'attribute-value-double-quoted'
  | 'attribute-value-single-quoted'
  | 'attribute-value-unquoted'
  | 'after-attribute-value-quoted'
  | 'character-reference-in-attribute-value'
  | 'self-closing-start-tag' | CommentState;

interface EmitCharacter {
  type: 'emit-character';
  payload: string;
};

interface EmitTagToken {
  type: 'emit-tag-token';
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

interface CreateEndTagToken {
  type: 'create-end-tag';
  payload: string;
}

interface CreateAttribute {
  type: 'create-attribute';
  payload: string;
}

interface AppendTagName {
  type: 'append-tag-name';
  payload: string;
}

interface AppendBuffer {
  type: 'append-buffer';
  payload: string;
}

interface ClearBuffer {
  type: 'clear-buffer';
}

export interface OtherAction {
  type: '';
}

function createTransition(payload: TokenizerState): TransitionAction {
  return { type: 'transition', payload };
}

type Action = TransitionAction
  | CreateStartTagToken
  | CreateEndTagToken
  | CreateAttribute
  | AppendTagName
  | AppendBuffer
  | ClearBuffer
  | EmitCharacter
  | EmitTagToken
  | CommentAction
  | SetSelfClosing
  | OtherAction;

export function getNextToken(world: World, char: string): World {
  return getActions(char, world).reduce(mutateWorld, world);
}

function getActions(char: string, world: World): Action[] {
  switch (world.state) {
    case 'data':
      return handleData(char);
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
    default:
      throw new SyntaxError('unknown state');
  }
}

function mutateWorld(world: World, action: Action): World {
  switch (action.type) {
    case 'emit-character':
      return {
        buffer: world.buffer,
        state: world.state,
        currentToken: world.currentToken,
        currentAttribute: world.currentAttribute,
        tokens: [
          ...world.tokens,
          character(action.payload)
        ]
      }
    case 'transition':
      return {
        buffer: world.buffer,
        state: action.payload,
        currentToken: world.currentToken,
        currentAttribute: world.currentAttribute,
        tokens: world.tokens
      }
    case 'create-start-tag':
      return {
        buffer: world.buffer,
        state: world.state,
        currentToken: startTag(action.payload),
        currentAttribute: world.currentAttribute,
        tokens: world.tokens
      }
    case 'create-end-tag':
      return {
        buffer: world.buffer,
        state: world.state,
        currentToken: endTag(action.payload),
        currentAttribute: world.currentAttribute,
        tokens: world.tokens
      }
    case 'create-attribute':
      if (!world.currentToken) {
        throw new SyntaxError('no current token');
      }

      if (world.currentToken.type !== 'start-tag') {
        throw new SyntaxError('only start tags can have attributes');
      }

      const newAttribute: Attribute = {
        name: action.payload,
        value: ''
      };

      return {
        buffer: world.buffer,
        state: world.state,
        currentToken: {
          ...world.currentToken,
          attributes: [newAttribute]
        },
        currentAttribute: newAttribute,
        tokens: world.tokens
      }
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
        buffer: world.buffer,
        state: world.state,
        currentToken: {
          ...world.currentToken,
          tagName: `${world.currentToken.tagName}${action.payload}`
        },
        currentAttribute: world.currentAttribute,
        tokens: world.tokens
      }
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
    case 'emit-tag-token':
      if (!world.currentToken) {
        throw new SyntaxError('no tag token to emit');
      }

      if (!isTagToken(world.currentToken)) {
        throw new SyntaxError('cannot emit tag token because not a tag');
      }

      return {
        buffer: world.buffer,
        state: world.state,
        currentToken: null,
        currentAttribute: world.currentAttribute,
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

export function startTag(tagName: string, attributes: Attribute[] = [], selfClosing: boolean = false): StartTag {
  return {
    type: 'start-tag',
    tagName,
    selfClosing,
    attributes
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
    default:
      return [{ type: 'emit-character', payload: char }];
  }
}


function handleTagOpen(char: string): Action[] {
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
      { type: 'emit-tag-token' }
    ];

  } else {
    return [
      { type: 'append-tag-name', payload: char.toLowerCase() }
    ];
  }
}

function handleEndTagOpen(char: string): Action[] {
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
  if (char === '>') {
    return [
      { type: 'set-self-closing' },
      createTransition('data'),
      { type: 'emit-tag-token' }
    ]
  } else {
    throw unknownCharacter();
  }
}

function handleBeforeAttributeName(char: string): Action[] {
  if (char.match(WHITESPACE)) {
    return [];
  } else if (char === '/') {
    return [
      createTransition('self-closing-start-tag')
    ];
  } else if (char === '>') {
    return [
      { type: 'emit-tag-token' },
      createTransition('data')
    ];
  } else if ([`"`, `'`, '<', '='].indexOf(char) !== -1) {
    throw unknownCharacter();
  } else {
    return [
      { type: 'create-attribute', payload: char.toLowerCase() },
      createTransition('attribute-name')
    ]
  }
}

function handleAttributeName(char: string): Action[] {
  if (char.match(WHITESPACE)) {
    return [
      createTransition('after-attribute-name')
    ]
  } else {
    throw new Error('unhandled character');
  }
}

function handleMarkupDeclarationOpen(char: string, world: World): Action[] {
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

function unknownCharacter(): SyntaxError {
  return new SyntaxError('unknown character');
}