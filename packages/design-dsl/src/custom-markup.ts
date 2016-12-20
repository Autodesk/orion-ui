import { deepEqual } from 'assert';

type Attribute = Binding | JSObject | Lambda;

interface Lambda {
  type: 'lambda';
  bindings: string[];
  children: ASTNode[];
}

interface JSObject {
  type: 'jsobject';
  identifier: string;
  value: any;
}

interface Binding {
  type: 'binding',
  identifier: string;
  value: string;
}

interface ASTNode {
  keyword: string;
  attributes: Attribute[];
  children: ASTNode[];
}

const NOOP = (): void => { /* no-op */ }

/**
 * Read source in and return ASTNode
 */
function tokenize(source: string): ASTNode {
  type State =
    'init'
    | 'node-keyword'
    | 'node-attributes'
    | 'node-children';

  interface Scope {
    attributesBuffer: Attribute[];
    astBuffer: ASTNode[];
    children: Scope[];
  }

  interface Environment {
    /**
     * Describes the primary state of the tokenizer
     */
    state: State;

    /**
     * Describes a concurrent substate of the node-attributes
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
     * - while in node-keyword state (closing tag)
     * - while in node-attributes state (self closing tag)
     */
    closingNode: boolean;

    /**
     * Buffer which accumulates characters when in node-keyword
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

  const rootScope: Scope = {
    attributesBuffer: [],
    astBuffer: [],
    children: []
  }

  // env starts at root scope
  const env: Environment = {
    state: 'init',
    attrState: 'name',
    attrValueTerminator: null,
    attributeNameBuffer: '',
    attributeValueBuffer: '',
    closingNode: false,
    keywordBuffer: '',
    currentScope: rootScope,
    rootScope
  }

  interface Transition {
    enter: () => void;
    exit: () => void;
  }

  const transitions: { [key: string]: Transition } = {
    ['init']: {
      enter: NOOP,
      exit: () => {
        console.log('exit init');
      }
    },

    ['node-keyword']: {
      enter: () => {
        console.log('enter node-keyword');

        // Always reset closingNode on enter
        env.closingNode = false;

        // Start a new keywordBuffer
        env.keywordBuffer = '';
      },

      exit: () => {
        saveNodeToScope();
        // // If we are closing, make sure we're closing the proper tag
        // if (env.closingNode) {
        //   saveASTFromBuffer();
        // } else {
        //   env.keywordScope.push(env.keywordBuffer);
        //   // start an attributes buffer for this scope
        //   env.attributesBuffer.push([]);
        //   // start an ast buffer for this level of scope
        //   env.astBuffer.push([]);
        // }
      }
    },

    ['node-attributes']: {
      enter: () => {
        console.log('enter node-attributes');
      },

      exit: () => {
        console.log('exit node-attributes');

        saveBufferedAttribute();

        if (env.closingNode) {
          // self closing node
          saveNodeToScope();
        }
      }
    },

    ['node-children']: {
      /**
       * Entering node-children does the following:
       *
       * - creates the ASTNode for the keyword which was just defined
       * - adds attributes
       * - creates a new scope which is nested on the current scope
       */
      enter: () => {
        const newScope: Scope = {
          attributesBuffer: [],
          astBuffer: [],
          children: []
        }

        env.currentScope.children.push(newScope);
        env.currentScope = newScope;
      },

      exit: () => {
        console.log('exit node-children');
      }
    }
  }

  function saveBufferedAttribute() {
    if (env.attributeValueBuffer) {
      // try parsing JSON. if that doesn't work it must be a binding OR lambda
      try {
        const json = JSON.parse(env.attributeValueBuffer);
        const {attributesBuffer} = env.currentScope;

        attributesBuffer.push({
          type: 'jsobject',
          identifier: env.attributeNameBuffer,
          value: json
        });
      } catch (e) {
        // write to current node

      }
    }

    // Reset and get ready for next attribute
    env.attributeNameBuffer = '';
    env.attributeValueBuffer = '';
    env.attrState = 'name';
    env.attrValueTerminator = null;
  }

  function saveNodeToScope() {
    const {astBuffer, attributesBuffer} = env.currentScope;

    const newNode: ASTNode = {
      keyword: env.keywordBuffer,
      attributes: attributesBuffer,
      children: []
    };

    astBuffer.push(newNode);

    // TODO: take the last node from the parent scope and add this node to its children
  }

  function transition(next: State) {
    transitions[env.state].exit();
    transitions[next].enter();
    env.state = next;
  }

  function lessThan() {
    transition('node-keyword');
  }

  function greaterThan() {
    transition('node-children');
  }


  /**
   * TODO: if we're reading an attribute value we should let
   * forward slashes buffer instead
   *
   * <image src="/image.png" /> is valid
   */
  function forwardSlash() {
    if (env.state === 'node-attributes' && env.attrState === 'value') {
      // This is a part of the value, buffer it like a char
      keyword('/');
    } else {
      env.closingNode = true;
    }
  }

  function whitespace(char: string) {
    if (env.state === 'node-keyword') {
      transition('node-attributes');
    } else if (env.state === 'node-attributes') {
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
    if (env.state === 'node-attributes') {
      // if there is something in the buffer
      // when equals is pressed, move to collect
      // the argument value
      if (env.attributeNameBuffer) {
        env.attrState = 'value';
      }
    }
  }

  function keyword(char: string) {
    switch (env.state) {
      case 'node-keyword':
        bufferKeywordChar(char);
        break;
      case 'node-attributes':
        bufferAttributeChar(char);
        break;
      default:
        throw new SyntaxError(`unknown char ${char}`);
    }
  }

  for (var i = 0; i < source.length; i++) {
    const char = source.charAt(i);

    if (char === '<') {
      lessThan();
    } else if (char === '>') {
      greaterThan();
    } else if (char === '/') {
      forwardSlash();
    } else if (char.match(WHITESPACE)) {
      whitespace(char);
    } else if (char === '=') {
      equals();
    } else {
      keyword(char);
    }
  }

  if (env.rootScope.astBuffer.length === 0) {
    throw new SyntaxError('no nodes defined');
  }

  if (env.rootScope.astBuffer.length > 1) {
    throw new SyntaxError('there must be only 1 root node');
  }

  return env.rootScope.astBuffer[0];
}

const minimum = `
  <orion>
  </orion>
`;

const minAST: ASTNode = {
  keyword: 'orion',
  attributes: [],
  children: []
};

// deepEqual(tokenize(minimum), minAST);

const withImport = `
  <orion import=["toolbar"]>
  </orion>
`

const withImportAST: ASTNode = {
  keyword: 'orion',
  attributes: [
    {
      type: 'jsobject',
      identifier: 'import',
      value: ['toolbar']
    }
  ],
  children: []
};

// deepEqual(tokenize(withImport), withImportAST);

const withForwardSlash = `
  <orion import=["toolbar/new"]>
  </orion>
`;

const withForwardSlashAst: ASTNode = {
  keyword: 'orion',
  attributes: [
    {
      type: 'jsobject',
      identifier: 'import',
      value: ['toolbar/new']
    }
  ],
  children: []
};

// deepEqual(tokenize(withForwardSlash), withForwardSlashAst);

const withJSONValues = `
  <orion
    number=1
    string="hello world"
    boolean=true
    array=[
      "item1",
      "item2",
      "item3"
    ]
    object={
      "key": "value",
      "key2": ["value2"]
    }>
  </orion>
`

const withJSONValuesAST: ASTNode = {
  keyword: 'orion',
  attributes: [
    {
      type: 'jsobject',
      identifier: 'number',
      value: 1
    },
    {
      type: 'jsobject',
      identifier: 'string',
      value: 'hello world'
    },
    {
      type: 'jsobject',
      identifier: 'boolean',
      value: true
    },
    {
      type: 'jsobject',
      identifier: 'array',
      value: ['item1', 'item2', 'item3']
    },
    {
      type: 'jsobject',
      identifier: 'object',
      value: { key: 'value', key2: ['value2'] }
    }
  ],
  children: []
};

// deepEqual(tokenize(withSpaceInValue), withSpaceInValueAST);

const withChild = `
  <orion import=["toolbar"]>
    <image src="hello.png" />
  </orion>
`;

const withChildAST: ASTNode = {
  keyword: 'orion',
  attributes: [
    {
      type: 'jsobject',
      identifier: 'import',
      value: ['toolbar']
    }
  ],
  children: [
    {
      keyword: 'image',
      attributes: [
        {
          type: 'jsobject',
          identifier: 'src',
          value: 'hello.png'
        }
      ],
      children: []
    }
  ]
}

// deepEqual(tokenize(withChild), withChildAST);


const source = `
<orion>
  <component => items>
    <container display="flex" layout="row" paddingAll="small" background="black">
      <map items => item, index>
        <container display="flex" layout="row" paddingAll="medium" background="grey">
          <image src={item.src} height={item.height} width={item.width} />
          <text textContent={item.label} />
        </container>
      </map>
    </container>
  </component>
</orion>
`;

const exampleArray = `
<orion import=["toolbar"]>
  <toolbar items=[
    { "label": "item 1", src: "item1.png", "height": 100, "width": 100},
    { "label": "item 2", src: "item2.png", "height": 100, "width": 100},
    { "label": "item 3", src: "item3.png", "height": 100, "width": 100}] />
</orion>
`;

// syntax
// general form of a function call is<fn-name args>block</fn-name>
// => declares a first class function
// everything before => is arguments
// everything after => are function arguments
// arguments are , separated
// attributes are space seperated key="value"
// attribute values can be any JavaScript literal which can serialize to JSON
// curly braces {} are bindings, everything inside is captured as a string to be evaled later when the env is present

const newSourceJSON: ASTNode = {
  keyword: 'orion',
  attributes: [
    {
      type: 'jsobject',
      identifier: 'import',
      value: []
    }
  ],
  children: [
    {
      keyword: 'component',
      attributes: [
        {
          type: 'lambda',
          bindings: ['items'],
          children: [
            {
              keyword: 'container',
              attributes: [
                { type: 'jsobject', identifier: 'display', value: 'flex' },
                { type: 'jsobject', identifier: 'layout', value: 'row' },
                { type: 'jsobject', identifier: 'paddingAll', value: 'small' },
                { type: 'jsobject', identifier: 'background', value: 'black' }
              ],

              children: [
                {
                  keyword: 'map',
                  attributes: [
                    {
                      type: 'jsobject',
                      identifier: 'items',
                      value: true
                    },
                    {
                      type: 'lambda',
                      bindings: ['item', 'index'],
                      children: [
                        {
                          keyword: 'container',
                          attributes: [
                            { type: 'jsobject', identifier: 'display', value: 'flex' },
                            { type: 'jsobject', identifier: 'layout', value: 'row' },
                            { type: 'jsobject', identifier: 'paddingAll', value: 'medium' },
                            { type: 'jsobject', identifier: 'background', value: 'grey' }
                          ],
                          children: [
                            {
                              keyword: 'image',
                              attributes: [
                                {
                                  type: 'binding',
                                  identifier: 'src',
                                  value: 'item.src'
                                },
                                {
                                  type: 'binding',
                                  identifier: 'height',
                                  value: 'item.height'
                                },
                                {
                                  type: 'binding',
                                  identifier: 'width',
                                  value: 'item.width'
                                }
                              ],
                              children: []
                            },
                            {
                              keyword: 'text',
                              attributes: [
                                {
                                  type: 'binding',
                                  identifier: 'textContent',
                                  value: 'item.label'
                                }
                              ],
                              children: []
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  children: []
                }
              ]
            }
          ]
        }
      ],

      children: []
    }
  ]
};

// const sourceAST = tokenize(source);

const newExampleArrayJson: ASTNode = {
  keyword: 'orion',
  attributes: [
    {
      type: 'jsobject',
      identifier: 'import',
      value: ['toolbar']
    }
  ],

  children: [
    {
      keyword: 'toolbar',
      attributes: [
        {
          type: 'jsobject',
          identifier: 'items',
          value: [
            { label: 'item 1', src: 'item1.png', height: 100, width: 100 },
            { label: 'item 2', src: 'item2.png', height: 100, width: 100 },
            { label: 'item 3', src: 'item3.png', height: 100, width: 100 }
          ]
        }
      ],
      children: []
    }
  ],
};

// PLAN

/**
 * compile toolbar.orn -> toolbar.js
 * - whatever the top level form is becomes the es6 default export
 * - components become functions which take props
 * - primitives become JSON objects
 *
 * // look at building a babel-register style importer
 *
 * Rendering
 *
 * import toolbar from './toolbar'; (after compiled)
 *
 */

// tokenize - source -> AST (json serializable)
// eval(ast, env)