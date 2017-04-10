/* eslint-env jest */
/* eslint-disable no-unused-expressions */
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
import { expect } from 'chai';

const formatMoment = require('./format-moment');
const moment = require('moment');

describe('Utils.formatMoment', () => {
  const date = moment('2017-04-01');
  const format = 'MMMM Do, YYYY';
  const locale = 'zh-cn';

  describe('without a date', () => {
    it('returns empty string', () => {
      expect(formatMoment()).to.eq('');
    });
  });

  describe('with date alone', () => {
    it('uses the default format', () => {
      const formattedDateWithoutZone = formatMoment(date).split('T')[0];
      expect(formattedDateWithoutZone).to.eq('2017-04-01');
    });
  });

  describe('with date and format', () => {
    it('uses the format', () => {
      expect(formatMoment(date, format)).to.eq('April 1st, 2017');
    });
  });

  describe('with date, format, and locale', () => {
    it('uses the locale', () => {
      expect(formatMoment(date, format, locale)).to.eq('四月 1日, 2017');
    });
  });
});
