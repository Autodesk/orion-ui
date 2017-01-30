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
import { withKnobs, text, select, boolean } from '@kadira/storybook-addon-knobs';
import { Button } from '../../react/lib/2016-12-01';
import SourceViewer from '../components/source_viewer';

const Example = require('../components/example');

const colorOptions = {
  '': '',
  black: 'Black',
  white: 'White',
  blue: 'Blue',
};

function filterEmptyProps(props) {
  const newProps = {};

  Object.entries(props).forEach(([key, value]) => {
    if (props[key] !== '') {
      newProps[key] = value;
    } else {
      newProps[key] = undefined;
    }
  });

  return newProps;
}

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => {
    const buttonText = text('Text', 'Hello, button!');
    const props = {
      background: select('Background Color', colorOptions, ''),
      color: select('Color', colorOptions, ''),
      onClick: action('clicked'),
    };

    const filteredProps = filterEmptyProps(props);

    const sources = [
      {
        label: 'React',
        source: `
          <Button
            background="${props.background}"
            color="${props.color}"
            onClick={action('clicked')}
          >
            {"${buttonText}"}
          </Button>
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
          // ------------------------------
          // controller.js

          import 'angular';
          import '@orion-ui/angular/lib/2016-12-01';

          angular
            .module('app', ['orion']) // include orion module
            .controller('DemoController', function() {
              var ctrl = this;

              ctrl.button = {
                label: '${buttonText}',
                color: '${props.color}',
                background: '${props.background}'
              };

              ctrl.action = function(arg) {
                alert(arg);
              }
            });

          // ------------------------------
          // index.html

          <!doctype html>
          <html>
          <body ng-app="app">
            <div ng-controller="DemoController as ctrl">
              <orion-button background="ctrl.button.background" color="ctrl.button.color" ng-click="ctrl.action('clicked')">
                {{ctrl.button.label}}
              </orion-button>
            </div>
          </body>
          </html>
        `,
      },
    ];

    return (
      <div>
        <Example {...filteredProps}>
          <Button {...filteredProps}>
            {buttonText}
          </Button>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  },
)

.add('disabled', () => {
  const buttonText = text('Text', 'Disabled button!');
  const props = {
    background: select('Background Color', colorOptions, ''),
    color: select('Color', colorOptions, ''),
    disabled: true,
  };

  const filteredProps = filterEmptyProps(props);

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          onClick={action('clicked')}
          disabled={${props.disabled}}
        >
          {"${buttonText}"}
        </Button>
      `,
    },
    {
      label: 'Angular 1.5.x',
      source: `
        // ------------------------------
        // controller.js

        import 'angular';
        import '@orion-ui/angular/lib/2016-12-01';

        angular
          .module('app', ['orion']) // include orion module
          .controller('DemoController', function() {
            var ctrl = this;

            ctrl.button = {
              label: '${buttonText}',
              color: '${props.color}',
              background: '${props.background}',
              disabled: '${props.disabled}'
            };

            ctrl.action = function(arg) {
              alert(arg);
            }
          });

        // ------------------------------
        // index.html

        <!doctype html>
        <html>
        <body ng-app="app">
          <div ng-controller="DemoController as ctrl">
            <orion-button background="ctrl.button.background" color="ctrl.button.color" ng-disabled="ctrl.button.disabled" ng-click="ctrl.action('clicked')">
              {{ctrl.button.label}}
            </orion-button>
          </div>
        </body>
        </html>
      `,
    },
  ];

  return (
    <div>
      <Example {...filteredProps}>
        <Button {...filteredProps}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
})
//
.add('hover state', () => {
  const buttonText = text('Text', 'Hover state');
  const props = {
    background: select('Background Color', colorOptions, ''),
    color: select('Color', colorOptions, ''),
    hover: boolean('Hover', true),
  };

  const filteredProps = filterEmptyProps(props);

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          hover="${props.hover}"
          onClick={action('clicked')}
        >
          {"${buttonText}"}
        </Button>
      `,
    },
    {
      label: 'Angular 1.5.x',
      source: `
        // ------------------------------
        // controller.js

        import 'angular';
        import '@orion-ui/angular/lib/2016-12-01';

        angular
          .module('app', ['orion']) // include orion module
          .controller('DemoController', function() {
            var ctrl = this;

            ctrl.button = {
              label: '${buttonText}',
              color: '${props.color}',
              background: '${props.background}'
            };

            ctrl.action = function(arg) {
              alert(arg);
            }
          });

        // ------------------------------
        // index.html

        <!doctype html>
        <html>
        <body ng-app="app">
          <div ng-controller="DemoController as ctrl">
            <orion-button background="ctrl.button.background" color="ctrl.button.color" ng-click="ctrl.action('clicked')">
              {{ctrl.button.label}}
            </orion-button>
          </div>
        </body>
        </html>
      `,
    },
  ];

  return (
    <div>
      <Example {...filteredProps}>
        <Button {...filteredProps}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
})

.add('small button', () => {
  const buttonText = text('Text', 'Hover state');
  const props = {
    background: select('Background Color', colorOptions, ''),
    color: select('Color', colorOptions, ''),
    size: 'small',
  };

  const filteredProps = filterEmptyProps(props);

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          onClick={action('clicked')}
          size="${props.size}"
        >
          {"${buttonText}"}
        </Button>
      `,
    },
    {
      label: 'Angular 1.5.x',
      source: `
        // ------------------------------
        // controller.js

        import 'angular';
        import '@orion-ui/angular/lib/2016-12-01';

        angular
          .module('app', ['orion']) // include orion module
          .controller('DemoController', function() {
            var ctrl = this;

            ctrl.button = {
              label: '${buttonText}',
              color: '${props.color}',
              background: '${props.background}',
              size: '${props.size}'
            };

            ctrl.action = function(arg) {
              alert(arg);
            }
          });

        // ------------------------------
        // index.html

        <!doctype html>
        <html>
        <body ng-app="app">
          <div ng-controller="DemoController as ctrl">
            <orion-button background="ctrl.button.background" color="ctrl.button.color" size="ctrl.button.size" ng-click="ctrl.action('clicked')">
              {{ctrl.button.label}}
            </orion-button>
          </div>
        </body>
        </html>
      `,
    },
  ];

  return (
    <div>
      <Example {...filteredProps}>
        <Button {...filteredProps}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
})

.add('large button', () => {
  const buttonText = text('Text', 'Hover state');
  const props = {
    background: select('Background Color', colorOptions, ''),
    color: select('Color', colorOptions, ''),
    size: 'large',
  };

  const filteredProps = filterEmptyProps(props);

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          onClick={action('clicked')}
          size="${props.size}"
        >
          {"${buttonText}"}
        </Button>
      `,
    },
    {
      label: 'Angular 1.5.x',
      source: `
        // ------------------------------
        // controller.js

        import 'angular';
        import '@orion-ui/angular/lib/2016-12-01';

        angular
          .module('app', ['orion']) // include orion module
          .controller('DemoController', function() {
            var ctrl = this;

            ctrl.button = {
              label: '${buttonText}',
              color: '${props.color}',
              background: '${props.background}',
              size: '${props.size}'
            };

            ctrl.action = function(arg) {
              alert(arg);
            }
          });

        // ------------------------------
        // index.html

        <!doctype html>
        <html>
        <body ng-app="app">
          <div ng-controller="DemoController as ctrl">
            <orion-button background="ctrl.button.background" color="ctrl.button.color" size="ctrl.button.size" ng-click="ctrl.action('clicked')">
              {{ctrl.button.label}}
            </orion-button>
          </div>
        </body>
        </html>
      `,
    },
  ];

  return (
    <div>
      <Example {...filteredProps}>
        <Button {...filteredProps}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
});
