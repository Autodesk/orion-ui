import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from './Button';

storiesOf('Button', module).addWithJSX('with text', () => (
  <Button onClick={action('clicked')} title="Hello Button" />
));
