const Display = require('./display');
const chai = require('chai');  // eslint-disable import/no-extraneous-dependencies

const expect = chai.expect;

describe.only('Display', () => {
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
