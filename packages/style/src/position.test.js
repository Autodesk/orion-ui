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
const Position = require('./position');
const chai = require('chai');

const expect = chai.expect;

describe('Position', () => {
  describe('attributeChangedCallback', () => {
    context('with a valid value', () => {
      [
        { value: 'absolute', result: 'pos-abs' },
        { value: 'relative', result: 'pos-rel' },
        { value: 'static', result: 'pos-sta' },
        { value: 'cover', result: 'pos-cov' },
      ].forEach(({ value, result }) => {
        context(`with ${value}`, () => {
          it(`returns class ${result}`, () => {
            expect(Position.attributeChangedCallback('position', value)).to.eq(result);
          });
        });
      });
    });

    context('with an invalid value', () => {
      it('raises an error', () => {
        expect(() => {
          Position.attributeChangedCallback('position', 'foobar');
        }).to.throw(Error);
      });
    });
  });
});
