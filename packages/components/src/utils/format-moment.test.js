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
const formatMoment = require('./format-moment');
const moment = require('moment');
const chai = require('chai');

const expect = chai.expect;

describe('Utils.formatMoment', () => {
  const date = moment('2017-04-01');
  const format = 'MMMM Do, YYYY';
  const locale = 'zh-cn';

  context('without a date', () => {
    it('returns empty string', () => {
      expect(formatMoment()).to.eq('');
    });
  });

  context('with date alone', () => {
    it('uses the default format', () => {
      expect(formatMoment(date)).to.eq('2017-04-01T00:00:00-07:00');
    });
  });

  context('with date and format', () => {
    it('uses the format', () => {
      expect(formatMoment(date, format)).to.eq('April 1st, 2017');
    });
  });

  context('with date, format, and locale', () => {
    it('uses the locale', () => {
      expect(formatMoment(date, format, locale)).to.eq('四月 1日, 2017');
    });
  });
});
