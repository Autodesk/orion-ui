import { OContainer } from './primitives';

interface ElementNode {
  type: 'element';
  identifier: string;
  attributes: Attribute[];
  children: (ElementNode | TextNode)[];
}

interface Attribute {
  identifier: string;
  value: StringValue;
}

interface StringValue {
  type: 'string';
  data: string;
}

interface TextNode {
  type: 'text';
  attributes: {
    textContent: string;
  }
}

const simple = `
  <!-- root element must always be orion -->
  <orion>
    <container display="inline" paddingAll="small">
      <text color="white" fontSize="f1" lineHeight="title">Hello World!</text>
    </container>
  </orion>
`;

const simpleTypeError1 = `
1  <!-- root element must always be orion -->
2  <orion>
3    <container display="inline" paddingAll="small">
                        ^ 1                 ^ 2
4      <text color="white" fontSize="f1" lineHeight="title">Hello World!</text>

Errors:

1 - "inline" is not assignable to display. Acceptable values are: "block", "tile".
2 - "small" is not assignable to paddingAll. Acceptable values are: 1, 2, 3, 4, 5.
`;

const simpleTypeError2 = `
1  <!-- root element must always be orion -->
2  <orion>
3    <container display="inline" paddingAll="small">
                                           ^ 1
4      <text color="white" fontSize="f1" lineHeight="title">Hello World!</text>

Errors:

1 - "small" is no longer supported. Replacement value is 2.
    Previous: <container paddingAll="small">
    New:      <container paddingAll=2>
`;

const simpleAST: ElementNode =
  {
    type: 'element',
    identifier: 'orion',
    attributes: [],
    children: [
      {
        type: 'element',
        identifier: 'container',
        attributes: [
          {
            identifier: 'display',
            value: { type: 'string', data: 'inline' }
          },
          {
            identifier: 'paddingAll',
            value: { type: 'string', data: 'small' }
          }
        ],

        children: [
          {
            type: 'element',
            identifier: 'text',
            attributes: [
              {
                identifier: 'color',
                value: { type: 'string', data: 'white' },
              },
              {
                identifier: 'fontSize',
                value: { type: 'string', data: 'f1' }
              },
              {
                identifier: 'lineHeight',
                value: { type: 'string', data: 'title' }
              }
            ],
            children: [
              {
                type: 'text',
                attributes: {
                  textContent: 'Hello World!'
                }
              }
            ]
          }
        ]
      }
    ]
  }