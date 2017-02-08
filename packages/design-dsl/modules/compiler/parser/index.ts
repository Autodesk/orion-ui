import {Node} from '../types';

export default class Parser {
  parse(source: string): Node {
    return {
        tagName: 'orion',
        attributes: [],
        children: [
          {
            tagName: 'component',
            blockParameters: ['name'],
            children: [
              {
                tagName: 'text',
                attributes: [
                  { type: 'json', name: 'size', value: '3' },
                  { type: 'json', name: 'content', value: '"Hello, {name}"' }
                ]
              }
            ]
          }
        ]
      }
  }
}