import '../vendor/custom-elements-polyfill';

import { configure, addDecorator } from '@kadira/storybook';
import { withKnobs } from '@kadira/storybook-addon-knobs';

import WithExample from './addons/example-addon';

function loadStories() {
  require('../stories/button.js');
  require('../stories/select');
  require('../stories/datepicker');
  // You can require as many stories as you need.
}

addDecorator(WithExample);
addDecorator(withKnobs)

configure(loadStories, module);
