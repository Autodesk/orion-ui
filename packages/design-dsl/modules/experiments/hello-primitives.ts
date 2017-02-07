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
