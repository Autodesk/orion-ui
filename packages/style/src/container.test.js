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
const Container = require('./container');
const chai = require('chai');

const expect = chai.expect;

describe('Container', () => {
  describe('attributeChangedCallback', () => {
    context('with a valid value', () => {
      [
        { value: 'column', result: 'con-col' },
        { value: 'row', result: 'con-row' }
      ].forEach(({ value, result }) => {
        context(`with ${value}`, () => {
          it(`returns class ${result}`, () => {
            expect(
              Container.attributeChangedCallback('container', value)
            ).to.eq(result);
          });
        });
      });
    });

    context('with an invalid value', () => {
      it('raises an error', () => {
        expect(() => {
          Container.attributeChangedCallback('container', 'foobar');
        }).to.throw(Error);
      });
    });
  });
});
