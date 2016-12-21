export type Attribute = Binding | JSObject | Lambda;

export interface Lambda {
  type: 'lambda';
  bindings: string[];
  children: ASTNode[];
}

export interface JSObject {
  type: 'jsobject';
  identifier: string;
  value: any;
}

export interface Binding {
  type: 'binding',
  identifier: string;
  value: string;
}

export interface ASTNode {
  keyword: string;
  attributes: Attribute[];
  children: ASTNode[];
}

const NOOP = (): void => { /* no-op */ }

type State =
  'init'
  | 'keyword'
  | 'attributes'
  | 'children';


interface Scope {
  currentNode: ASTNode | null;
  astBuffer: ASTNode[];
  children: Scope[];
  // Only the root scope has a null parent
  parent: Scope | null;
}

interface Environment {
  /**
   * What line of source code the tokenizer is currently on
   */
  line: number;

  /**
   * What column of source code the tokenizer is currently on
   */
  column: number;

  /**
   * Describes the primary state of the tokenizer
   */
  state: State;

  /**
   * Describes a concurrent substate of the attributes
   * state. We are either reading the name or value of the attribute
   */
  attrState: 'name' | 'value';

  /**
   * For the given attribute value, what is the close characters
   * if it is null it hasn't been determined yet
   */
  attrValueTerminator: RegExp | null;

  /**
   * Tokenizer reads to this when argstate is name
   */
  attributeNameBuffer: string;

  /**
   * Tokenizer reads to this when artstate is value
   */
  attributeValueBuffer: string;

  /**
   * Set to true when a forward slash is encountered
   * - while in keyword state (closing tag)
   * - while in attributes state (self closing tag)
   */
  closingNode: boolean;

  /**
   * Set to true when in attributes.name state and the scanner
   * encounters a /
   */
  selfClosing: boolean;

  /**
   * Buffer which accumulates characters when in keyword
   */
  keywordBuffer: string;

  /**
   * Tree of AST nodes plus related metadata
   * - this value is never overridden
   */
  rootScope: Scope;

  /**
   * The current scope
   * - this value is overriden when we move to child nodes of a keyword
   */
  currentScope: Scope;
}

interface Transition {
  enter: () => void;
  exit: () => void;
}

/**
 * Read source in and return ASTNode
 */
export function tokenize(source: string): ASTNode {
  const rootScope: Scope = {
    currentNode: null,
    children: [],
    astBuffer: [],
    parent: null
  }

  // env starts at root scope
  const env: Environment = {
    line: 0,
    column: 0,
    state: 'init',
    attrState: 'name',
    attrValueTerminator: null,
    attributeNameBuffer: '',
    attributeValueBuffer: '',
    closingNode: false,
    selfClosing: false,
    keywordBuffer: '',
    currentScope: rootScope,
    rootScope
  }

  function transition(next: State) {
    if (transitions[env.state]) {
      transitions[env.state].exit();
    }

    if (transitions[next]) {
      transitions[next].enter();
    }

    env.state = next;
  }

  const transitions: { [key: string]: Transition } = {
    keyword: {
      enter: enterKeyword,
      exit: exitKeyword
    },

    attributes: {
      enter: enterAttributes,
      exit: exitAttributes
    },

    children: {
      enter: enterChildren,
      exit: exitChildren
    }
  }

  function enterKeyword() {
    env.keywordBuffer = '';
  }

  function exitKeyword() {
    // Only save nodes for opening tags
    if (!env.closingNode) {
      saveNodeToScope();
    }
  }

  function testClosingTag(): void {
    if (env.currentScope.parent) {
      const testNode = env.selfClosing
        ? env.currentScope.astBuffer[env.currentScope.astBuffer.length - 1]
        : env.currentScope.parent.astBuffer[env.currentScope.parent.astBuffer.length - 1];

      if (testNode.keyword !== env.keywordBuffer) {
        throw new SyntaxError('unbalanced tags');
      }
    } else {
      // no parent node - could be root?
    }
  }

  function setCurrentScopeToParent(): void {
    const parentScope = env.currentScope.parent;

    if (!env.currentScope.parent) {
      // we must be at the root scope already
      return;
    }

    env.currentScope = env.currentScope.parent;
  }

  function createChildScope(): void {
    const newScope: Scope = {
      currentNode: null,
      children: [],
      astBuffer: [],
      parent: env.currentScope
    }

    env.currentScope.children.push(newScope);
    env.currentScope = newScope;
  }

  function enterAttributes() {
    console.log('enter attributes');

  }

  function exitAttributes() {
    console.log('exit attributes');
  }

  /**
   * Entering children does the following:
   *
   * - creates the ASTNode for the keyword which was just defined
   * - adds attributes
   * - creates a new scope which is nested on the current scope
   */
  function enterChildren() {
    // If the last node is a closing node, go up a scope
    // Otherwise create a child scope
    if (env.closingNode) {
      testClosingTag();
      setCurrentScopeToParent();
    } else {
      createChildScope();
    }

    // Entering children resets closingNode state
    env.closingNode = false;
    env.selfClosing = false;
  }

  function exitChildren() {
    console.log('exit children');
  }

  function saveBufferedAttribute() {
    if (!env.attributeValueBuffer) {
      throw new SyntaxError('no value for attribute');
    }

    // Try parsing the json and if it throws an exception that is a JSON unexpected
    // end of input, we should continue buffering... if we get to the end of the buffer then we error out
    try {
      saveJSONAttributeValue();
      resetAttributeState();
    } catch (e) {
      // TODO this might be flaky way to catch JSON errors
      if (e.message !== 'Unexpected end of JSON input') {
        throw e;
      }
    }
  }

  function saveJSONAttributeValue() {
    const json = JSON.parse(env.attributeValueBuffer);
    if (env.currentScope.currentNode) {
      env.currentScope.currentNode.attributes.push({
        type: 'jsobject',
        identifier: env.attributeNameBuffer,
        value: json
      });
    } else {
      throw new SyntaxError('currentNode should not be null');
    }
  }

  // Reset and get ready for next attribute
  function resetAttributeState() {
    env.attributeNameBuffer = '';
    env.attributeValueBuffer = '';
    env.attrState = 'name';
    env.attrValueTerminator = null;
  }

  function saveNodeToScope() {
    const newNode: ASTNode = {
      keyword: env.keywordBuffer,
      attributes: [],
      children: []
    };

    // Store reference in astBuffer
    env.currentScope.astBuffer.push(newNode);

    // Set the currentNode to this node so attributes get added correctly
    env.currentScope.currentNode = newNode;

    // Associate with the parent node
    if (env.currentScope.parent) {
      if (env.currentScope.parent.currentNode) {
        env.currentScope.parent.currentNode.children.push(newNode);
      } else {
        throw new Error('how did we get into this state?');
      }
    } else {
      // no parent - must be root node?
    }
  }

  function lessThan() {
    // attributes value state takes precendance over transitioning
    if (env.state === 'attributes' && env.attrState === 'value') {
      env.attributeValueBuffer += '<';
    } else {
      transition('keyword');
    }
  }

  function greaterThan() {
    // attributes value state takes precendance over transitioning
    if (env.state === 'attributes' && env.attrState === 'value') {
      env.attributeValueBuffer += '>';
    } else {
      transition('children');
    }
  }

  function forwardSlash() {
    if (env.state === 'attributes' && env.attrState === 'value') {
      // This is a part of the value, buffer it like a char
      keyword('/');
    } else {
      if (env.state === 'attributes') {
        env.selfClosing = true;
      }

      env.closingNode = true;
    }
  }

  function whitespace(char: string) {
    if (env.state === 'keyword') {
      transition('attributes');
    } else if (env.state === 'attributes') {
      // We buffer whitespace for attribute values
      if (env.attrState === 'value') {
        env.attributeValueBuffer += char;
      }

      if (env.attrValueTerminator && ' '.match(env.attrValueTerminator)) {
        saveBufferedAttribute();
      }
    }
  }

  function bufferKeywordChar(char: string) {
    env.keywordBuffer += char;
  }

  function isNumber(char: any): boolean {
    return !isNaN(char);
  }

  const WHITESPACE = /\s/;

  function setAttrValueTerminator(char: string) {
    // Numbers, true, or false are whitespace terminated
    if (isNumber(char) || char === 't' || char === 'f') {
      env.attrValueTerminator = WHITESPACE;
      // Strings are double-quote terminated
    } else if (char === '"') {
      env.attrValueTerminator = /"/;
    } else if (char === "{") {
      env.attrValueTerminator = /}/;
    } else if (char === '[') {
      env.attrValueTerminator = /]/;
    } else {
      throw new SyntaxError(`${env.attributeNameBuffer} must be a valid JSON value`);
    }
  }

  function bufferAttributeChar(char: string) {
    if (env.attrState === 'name') {
      env.attributeNameBuffer += char;
    } else {
      env.attributeValueBuffer += char;

      // If this hasn't been set yet then set it here
      if (!env.attrValueTerminator) {
        setAttrValueTerminator(char);
      } else {
        if (char.match(env.attrValueTerminator)) {
          saveBufferedAttribute();
        }
      }

    }
  }

  function equals() {
    if (env.state === 'attributes') {
      if (env.attrState == 'name') {
        env.attrState = 'value';
      } else {
        env.attributeValueBuffer += '=';
      }
    }
  }

  function keyword(char: string) {
    switch (env.state) {
      case 'keyword':
        bufferKeywordChar(char);
        break;
      case 'attributes':
        bufferAttributeChar(char);
        break;
      default:
        throw new SyntaxError(`unknown char ${char}`);
    }
  }

  function testForBadJson() {
    if (env.state === 'attributes' && env.attrState === 'value') {
      throw new SyntaxError(`${env.attributeNameBuffer} has a bad value.`)
    }
  }

  function scan(source: string): void {
    for (var i = 0; i < source.length; i++) {
      const char = source.charAt(i);

      // increment column count
      env.column += 1;

      if (char === '<') {
        lessThan();
      } else if (char === '>') {
        greaterThan();
      } else if (char === '/') {
        forwardSlash();
      } else if (char.match(WHITESPACE)) {
        // TODO: windows newlines?
        if (char === '\n') {
          env.line += 1;
          env.column = 0;
        }

        whitespace(char);
      } else if (char === '=') {
        equals();
      } else {
        keyword(char);
      }
    }
  }

  scan(source);

  testForBadJson();

  if (env.rootScope.astBuffer.length === 0) {
    throw new Error('no nodes defined');
  }

  // Return first node
  return env.rootScope.astBuffer[0];
}
