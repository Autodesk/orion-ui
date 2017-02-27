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
import { storiesOf } from '@kadira/storybook';

import unfocusedWoDate from './datepicker/unfocused-wo-date';
import unfocusedWithDate from './datepicker/unfocused-with-date';
import clearable from './datepicker/clearable';
import customPlaceholderText from './datepicker/custom-placeholder-text';
import focus from './datepicker/focus';
import focusMonthAndDay from './datepicker/focus-month-and-day';
import customDateFormatting from './datepicker/custom-date-formatting';
import i18n from './datepicker/i18n';
import customDisabledDates from './datepicker/custom-disabled-dates';
import disabled from './datepicker/disabled';
import interactive from './datepicker/interactive';

storiesOf('Datepicker', module)
  .add('unfocused w/o date', unfocusedWoDate)
  .add('unfocused w date', unfocusedWithDate)
  .add('clearable', clearable)
  .add('custom placeholder text', customPlaceholderText)
  .add('focus', focus)
  .add('focus month & day', focusMonthAndDay)
  .add('custom date formatting', customDateFormatting)
  .add('i18n', i18n)
  .add('custom disabled dates', customDisabledDates)
  .add('disabled', disabled)
  .add('interactive', interactive);
