/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
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