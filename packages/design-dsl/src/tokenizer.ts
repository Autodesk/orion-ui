import { ES2015_IDENTIFIER } from './utils/es6-identifier-regex';

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
  'children'
  | 'keyword'
  | 'attributes'
  | 'lambda';


interface Scope {
  currentNode: ASTNode | null;
  currentLambda: Lambda | null;
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

  attrValueMaybeBinding: boolean;
  attrValueIsBinding: boolean;

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

  maybeLambda: boolean;

  handleChar: ((char: string) => void);

  lambdaBindingBuffer: string;
}

interface Transition {
  enter: () => void;
  exit: () => void;
  handleChar: (char: string) => void;
}

/**
 * Read source in and return ASTNode
 */
export function tokenize(source: string): ASTNode {
  const transitions: { [key: string]: Transition } = {
    keyword: {
      enter: enterKeyword,
      exit: exitKeyword,
      handleChar: handleKeywordChar
    },

    attributes: {
      enter: enterAttributes,
      exit: exitAttributes,
      handleChar: handleAttributesChar
    },

    children: {
      enter: enterChildren,
      exit: exitChildren,
      handleChar: handleChildrenChar
    },

    lambda: {
      enter: enterLambda,
      exit: exitLambda,
      handleChar: handleLambdaChar
    }
  }

  const rootScope: Scope = {
    currentNode: null,
    currentLambda: null,
    children: [],
    astBuffer: [],
    parent: null
  }

  // env starts at root scope
  const env: Environment = {
    line: 0,
    column: 0,
    state: 'children',
    attrState: 'name',
    attrValueTerminator: null,
    attrValueMaybeBinding: false,
    attrValueIsBinding: false,
    attributeNameBuffer: '',
    attributeValueBuffer: '',
    closingNode: false,
    selfClosing: false,
    keywordBuffer: '',
    currentScope: rootScope,
    rootScope,

    maybeLambda: false,
    lambdaBindingBuffer: '',
    handleChar: transitions['children'].handleChar
  }

  function transition(next: State) {
    if (transitions[env.state]) {
      transitions[env.state].exit();
    }

    if (transitions[next]) {
      transitions[next].enter();
      env.handleChar = transitions[next].handleChar;
    }

    env.state = next;
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

  function handleKeywordChar(char: string) {
    if (char === '>') {
      transition('children');
    } else if (char.match(WHITESPACE)) {
      transition('attributes');
    } else if (char === '/') {
      env.closingNode = true;
    } else {
      bufferKeywordChar(char);
    }
  }

  function enterAttributes() {
    // console.log('enter attributes');

  }

  function exitAttributes() {
    // console.log('exit attributes');
  }

  function handleAttributesChar(char: string): void {
    if (env.attrState === 'value') {
      bufferAttributeChar(char);
    } else {
      if (char === '>') {
        if (env.maybeLambda) {
          transition('lambda');
          env.maybeLambda = false;
        } else {
          transition('children');
        }
      } else if (char === '/') {
        env.selfClosing = true;
        env.closingNode = true;
      } else if (char.match(WHITESPACE)) {
        if (env.attrValueTerminator && ' '.match(env.attrValueTerminator)) {
          saveBufferedAttribute();
        } else {
          // ignore whitespace
        }
      } else if (char === '=') {
        // If there is no attribute name, it may be a lambda
        // The next scan will confirm if the > is also passed
        if (env.attributeNameBuffer == '') {
          env.maybeLambda = true;
        } else {
          env.attrState = 'value'
        }
      } else {
        bufferAttributeChar(char);
      }
    }
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
      currentLambda: null,
      children: [],
      astBuffer: [],
      parent: env.currentScope
    }

    env.currentScope.children.push(newScope);
    env.currentScope = newScope;
  }


  function exitChildren() {
    // console.log('exit children');
  }

  function handleChildrenChar(char: string): void {
    if (char === '<') {
      transition('keyword');
    }
  }

  function saveBufferedAttribute() {
    if (!env.attributeValueBuffer) {
      throw new SyntaxError('no value for attribute');
    }

    if (env.attrValueIsBinding) {
      saveAttributeBinding();
      resetAttributeState();
    } else {
      // Try parsing the json and if it throws an exception that is a JSON unexpected
      // end of input, we should continue buffering... if we get to the end of the buffer then we error out
      try {
        saveAttributeJSObject();
        resetAttributeState();
      } catch (e) {
        // TODO this might be flaky way to catch JSON errors
        if (e.message !== 'Unexpected end of JSON input') {
          throw e;
        }
      }
    }
  }

  function saveAttributeBinding(): void {
    if (env.currentScope.currentNode) {
      env.currentScope.currentNode.attributes.push({
        type: 'binding',
        identifier: env.attributeNameBuffer,
        // strip the start and ending curly braces
        value: env.attributeValueBuffer.slice(1, env.attributeValueBuffer.length - 1)
      });
    }
  }

  function saveAttributeJSObject() {
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
    env.attrValueIsBinding = false;
    env.attrValueMaybeBinding = false;
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
        // If the parent scope has a lambda, add this node to the lambdas children
        if (env.currentScope.parent.currentLambda) {
          env.currentScope.parent.currentLambda.children.push(newNode);
        } else {
          env.currentScope.parent.currentNode.children.push(newNode);
        }
      } else {
        throw new SyntaxError('how did we get into this state?');
      }
    } else {
      // no parent - must be root node?
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
    if (env.attrValueMaybeBinding) {
      if (!char.match(WHITESPACE)) {
        // JSON objects always have a double quote as the next characters
        // After the opening object, bindings never do
        if (char !== '"') {
          env.attrValueIsBinding = true;
        }

        // Both objects and bindings have the same terminator
        env.attrValueTerminator = /}/;
      } else {
        // Ignore whitespace
      }
    } else {
      // Numbers, true, or false are whitespace terminated
      if (isNumber(char) || char === 't' || char === 'f') {
        env.attrValueTerminator = WHITESPACE;
        // Strings are double-quote terminated
      } else if (char === '"') {
        env.attrValueTerminator = /"/;
      } else if (char === "{") {
        // Defer deciding terminator until later
        env.attrValueMaybeBinding = true;
      } else if (char === '[') {
        env.attrValueTerminator = /]/;
      } else {
        throw new SyntaxError(`${env.attributeNameBuffer} must be a valid JSON value`);
      }
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

  function testForBadJson() {
    if (env.state === 'attributes' && env.attrState === 'value') {
      throw new SyntaxError(`${env.attributeNameBuffer} has a bad value.`)
    }
  }

  function enterLambda(): void {
    // Create lambda node
    const newNode: Lambda = {
      type: 'lambda',
      bindings: [],
      children: []
    }

    if (env.currentScope.currentNode) {
      env.currentScope.currentNode.attributes.push(newNode);
    }

    env.currentScope.currentLambda = newNode;
    env.lambdaBindingBuffer = '';
  }

  function exitLambda(): void {
    // console.log('exit lambda');
  }

  function handleLambdaChar(char: string): void {
    if (char === ',') {
      saveLambdaBinding();
    } else if (char === '>') {
      saveLambdaBinding();
      transition('children');
    } else if (char.match(WHITESPACE)) {
      // ignore
    } else {
      env.lambdaBindingBuffer += char;
    }
  }

  function saveLambdaBinding(): void {
    if (env.lambdaBindingBuffer.match(ES2015_IDENTIFIER)) {
      if (env.currentScope.currentLambda) {
        env.currentScope.currentLambda.bindings.push(env.lambdaBindingBuffer);
      } else {
        throw new SyntaxError('lambda not defined');
        // throw error - lambda not defined
      }
    } else {
      throw new SyntaxError(`${env.lambdaBindingBuffer} is not an ES2015 compatible identifier.`);
      // throw error - bad identifier
    }

    env.lambdaBindingBuffer = '';
  }


  function scan(source: string): void {
    for (var i = 0; i < source.length; i++) {
      const char = source.charAt(i);

      // increment column count
      env.column += 1;

      // TODO: windows newlines?
      if (char === '\n') {
        env.line += 1;
        env.column = 0;
      }

      env.handleChar(char);
    }
  }

  scan(source);

  testForBadJson();

  if (env.rootScope.astBuffer.length === 0) {
    throw new SyntaxError('no nodes defined');
  }

  // Return first node
  return env.rootScope.astBuffer[0];
}
