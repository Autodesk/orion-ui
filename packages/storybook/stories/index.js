import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, text, select } from '@kadira/storybook-addon-knobs';

const colorOptions = {
  '#000000': 'Black',
  '#ffffff': 'White',
};

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => (
    <button
      style={{
        appearance: 'none',
        border: '1px solid #999',
        color: select('Color', colorOptions, '#000000'),
        backgroundColor: select('Background Color', colorOptions, '#ffffff'),
      }} onClick={action('clicked')}
    >{text('Text', 'Hello, button!')}</button>
));
