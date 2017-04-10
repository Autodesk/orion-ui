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

import withText from './button/with-text';
import disabled from './button/disabled';
import hover from './button/hover';
import small from './button/small';
import large from './button/large';
import focus from './button/focus';

storiesOf('Button', module)
  .add('with text', withText)
  .add('disabled', disabled)
  .add('hover', hover)
  .add('small', small)
  .add('large', large)
  .add('focus', focus);
