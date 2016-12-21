import { deepEqual } from 'assert';
import { tokenize, ASTNode } from './tokenizer';

const minimum = `
  <orion>
  </orion>
`;

const minAST: ASTNode = {
  keyword: 'orion',
  attributes: [],
  children: []
};

deepEqual(tokenize(minimum), minAST);

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

deepEqual(tokenize(withImport), withImportAST);

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

deepEqual(tokenize(withForwardSlash), withForwardSlashAst);

const withJSONValues = `
  <orion
    number=1
    string="<hello world='thing' />"
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
      value: `<hello world='thing' />`
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

deepEqual(tokenize(withJSONValues), withJSONValuesAST);

const withChild = `
  <orion import=["toolbar"]>
    <image src="hello.png"></image>
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

deepEqual(tokenize(withChild), withChildAST);

const withSelfClosing = `
  <orion>
    <image src="hello.png" />
  </orion>
`

const withSelfClosingAST: ASTNode = {
  keyword: 'orion',
  attributes: [],
  children: [
    {
      keyword: 'image',
      attributes: [
        {
          identifier: 'src',
          type: 'jsobject',
          value: 'hello.png'
        }
      ],
      children: []
    }
  ]
}

deepEqual(tokenize(withSelfClosing), withSelfClosingAST);

const withNestedJson = `
  <orion
  array=[
    ["foo1", "bar1"],
    ["foo2", "bar2"]
  ]

  object={
    "key": {
      "sub-key": "value"
    }
  }>
  </orion>
`

const withNestedJsonAST: ASTNode = {
  keyword: 'orion',
  attributes: [
    {
      type: 'jsobject',
      identifier: 'array',
      value: [
        ['foo1', 'bar1'],
        ['foo2', 'bar2']
      ]
    },
    {
      type: 'jsobject',
      identifier: 'object',
      value: {
        key: {
          'sub-key': 'value'
        }
      }
    }
  ],
  children: []
}

deepEqual(tokenize(withNestedJson), withNestedJsonAST);

const withBadJson = `
  <orion
    good="value"
    array=[
      ["foo1", "bar"
    ]>
  </orion>
`;

try {
  tokenize(withBadJson)
} catch (e) {
  deepEqual(e.message, 'array has a bad value.');
}

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