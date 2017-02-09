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
                  { type: 'json', name: 'fontSize', value: '"s"' },
                  { type: 'json', name: 'content', value: '"Hello, {name}"' }
                ]
              }
            ]
          }
        ]
      }
  }
}