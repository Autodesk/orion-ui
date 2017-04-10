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
const PointerEvents = require('./pointer-events');
const chai = require('chai');

const expect = chai.expect;

describe('PointerEvents', () => {
  describe('attributeChangedCallback', () => {
    context('with a valid value', () => {
      [
        { value: 'initial', result: 'pe-initial' },
        { value: 'none', result: 'pe-none' }
      ].forEach(({ value, result }) => {
        context(`with ${value}`, () => {
          it(`returns class ${result}`, () => {
            expect(
              PointerEvents.attributeChangedCallback('pointerEvents', value)
            ).to.eq(result);
          });
        });
      });
    });

    context('with an invalid value', () => {
      it('raises an error', () => {
        expect(() => {
          PointerEvents.attributeChangedCallback('pointerEvents', 'foobar');
        }).to.throw(Error);
      });
    });
  });
});
