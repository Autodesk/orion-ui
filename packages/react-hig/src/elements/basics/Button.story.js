import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { string } from '@storybook/addon-knobs';

import Button from './Button';

storiesOf('Button', module).addWithInfo('with text', `foo bar`, () => (
  <Button onClick={action('clicked')} title="Hello Button" />
));
