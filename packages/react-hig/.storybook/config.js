import { configure, addDecorator, setAddon } from '@kadira/storybook';
import { withKnobs } from '@kadira/storybook-addon-knobs';
import JSXAddon from 'storybook-addon-jsx';

import WithExample from './addons/example-addon';

function loadStories() {
  require('../src/stories');
}

addDecorator(WithExample);
addDecorator(withKnobs);

setAddon(JSXAddon);

configure(loadStories, module);
