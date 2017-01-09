/* eslint-disable import/no-extraneous-dependencies */
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
const expect = require('chai').expect;

const intersection = require('./intersection.js');

describe('intersection', () => {
  context('with arrays with intersecting values', () => {
    it('return the intersecting values', () => {
      const array1 = ['a', 'b', 'c'];
      const array2 = ['b', 'c', 'd'];
      const result = intersection(array1, array2);

      expect(result).not.to.contain('a');
      expect(result).to.contain('b');
      expect(result).to.contain('c');
      expect(result).not.to.contain('d');
    });
  });

  context('with arrays without intersecting values', () => {
    it('returns an empty array', () => {
      const array1 = ['a', 'b'];
      const array2 = ['c', 'd'];
      const result = intersection(array1, array2);

      expect(result.length).to.eq(0);
    });
  });
});
