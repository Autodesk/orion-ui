const Position = require('./position');
const chai = require('chai');  // eslint-disable import/no-extraneous-dependencies

const expect = chai.expect;

describe.only('Position', () => {
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
