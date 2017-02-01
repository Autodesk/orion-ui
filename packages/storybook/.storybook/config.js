import '../vendor/custom-elements-polyfill';
import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/button.js');
  require('../stories/select');
  require('../stories/datepicker');
  // You can require as many stories as you need.
}

configure(loadStories, module);
