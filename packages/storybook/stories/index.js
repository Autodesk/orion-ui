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
