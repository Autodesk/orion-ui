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
const Display = require('./display');
const chai = require('chai');

const expect = chai.expect;

describe('Display', () => {
  describe('attributeChangedCallback', () => {
    context('with a valid value', () => {
      [
        { value: 'block', result: 'dis-blk' },
        { value: 'flex', result: 'dis-flx' },
        { value: 'inline', result: 'dis-inl' },
        { value: 'inline-block', result: 'dis-inb' },
      ].forEach(({ value, result }) => {
        context(`with ${value}`, () => {
          it(`returns class ${result}`, () => {
            expect(Display.attributeChangedCallback('display', value)).to.eq(result);
          });
        });
      });
    });

    context('with an invalid value', () => {
      it('raises an error', () => {
        expect(() => {
          Display.attributeChangedCallback('display', 'foobar');
        }).to.throw(Error);
      });
    });
  });
});
