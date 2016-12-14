import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, text, select } from '@kadira/storybook-addon-knobs';
import Button from '../components/button';
import SourceViewer from '../components/source_viewer';

const colorOptions = {
  '#000000': 'Black',
  '#ffffff': 'White',
};

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => {
    const buttonText = text('Text', 'Hello, button!');
    const props = {
      backgroundColor: select('Background Color', colorOptions, '#ffffff'),
      color: select('Color', colorOptions, '#000000'),
      onClick: action('clicked'),
    };

    const sources = [
      {
        label: 'React',
        source: `
          <OrionButton
            backgroundColor={"${props.backgroundColor}"}
            color={"${props.color}"}
            onClick={action('clicked')}
          >
            {"${buttonText}"}
          </OrionButton>
        `,
      }, {
        label: 'Web components',
        source: `
          <orion-button
            backgroundColor={"${props.backgroundColor}"}
            color={"${props.color}"}
            onClick={action('clicked')}
          >
            {"${buttonText}"}
          </orion-button>
        `,
      },
    ];

    return (
      <div>
        <Button {...props}>
          {buttonText}
        </Button>
        <SourceViewer sources={sources} />
      </div>
    );
  },
);
