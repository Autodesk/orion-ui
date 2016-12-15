import {OContainer, OText} from './primitives';

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