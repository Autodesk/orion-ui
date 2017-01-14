const Container = require('./container');
const chai = require('chai');  // eslint-disable-line import/no-extraneous-dependencies

const expect = chai.expect;

describe('Container', () => {
  describe('attributeChangedCallback', () => {
    context('with a valid value', () => {
      [
        { value: 'column', result: 'con-col' },
        { value: 'row', result: 'con-row' },
      ].forEach(({ value, result }) => {
        context(`with ${value}`, () => {
          it(`returns class ${result}`, () => {
            expect(Container.attributeChangedCallback('container', value)).to.eq(result);
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
