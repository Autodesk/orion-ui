import {OContainer, OText} from './primitives';
import {primitiveToHtml} from './utils/gen-html';

const hello: OContainer = {
  type: 'container',
  props: {
    display: 'inline',
    paddingAll: 'small'
  },

  children: [{
    type: 'text',
    props: {
      color: 'white',
      fontSize: 'f1',
      lineHeight: 'title'
    },
    textContent: 'Hello World'
  }]
}

console.log(JSON.stringify(hello, null, 4));

console.log();
console.log('Converted to HTML');
console.log();

console.log(JSON.stringify(primitiveToHtml(hello), null, 4));
