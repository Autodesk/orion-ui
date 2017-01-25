import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/index.js');
  require('../stories/select');
  require('../stories/datepicker');
  // You can require as many stories as you need.
}

configure(loadStories, module);
