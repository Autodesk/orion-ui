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
import { withKnobs } from '@kadira/storybook-addon-knobs';

import collapsed from './select/collapsed';
import expanded from './select/expanded';
import disabledOption from './select/disabled-option';
import disabled from './select/disabled';
import optionFocus from './select/option-focus';
import focus from './select/focus';
import selectedIndex from './select/selected-index';
import noSearchResults from './select/no-search-results';
import someSearchResults from './select/some-search-results';
import clearable from './select/clearable';
import interactive from './select/interactive';
import kitchenSink from './select/kitchen-sink';

storiesOf('Select', module)
  .addDecorator(withKnobs)
  .add('collapsed', collapsed)
  .add('expanded', expanded)
  .add('disabled option', disabledOption)
  .add('disabled', disabled)
  .add('option focus', optionFocus)
  .add('focus', focus)
  .add('selectedIndex', selectedIndex)
  .add('no search results', noSearchResults)
  .add('some search results', someSearchResults)
  .add('clearable', clearable)
  .add('interactive', interactive)
  .add('kitchen sink', kitchenSink);
