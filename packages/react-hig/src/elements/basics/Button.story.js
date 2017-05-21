import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import Button from './Button';

storiesOf('Button', module).addWithInfo('regular button',
  <div>
    <p>
      A button is an element that a customer clicks or taps to trigger an action
      or change within the interface. To change the customer's location within
      or between interfaces, use a textual link.
    </p>
    <p>For content guidelines and common combinations of buttons, view
      the <a href="https://wiki.autodesk.com/display/HIG/Button+Text">button text content pattern</a>.</p>
  </div>, () => (
    <Button onClick={action('clicked')} title="Hello Button" />
  ));
