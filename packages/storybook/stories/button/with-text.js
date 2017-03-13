/* eslint-disable react/prop-types */
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
import { select, text } from '@kadira/storybook-addon-knobs';
import { action } from '@kadira/storybook';
import { colorOptions, filterEmptyProps } from '../shared';

import { Button } from '../../../react/lib/2016-12-01';
import { WithSource } from '../../addons/source-addon';

export default function withText() {
  const buttonText = text('Text', 'Hello, button!');

  const props = {
    background: select('Background Color', colorOptions, ''),
    color: select('Color', colorOptions, ''),
    onClick: action('clicked'),
  };

  const filteredProps = filterEmptyProps(props);

  const react = `
import React from 'react';
import { Button } from '../../../react/lib/2016-12-01';

class App extends React.Component {
render() {
  return (
    <Button
      background="${props.background}"
      color="${props.color}"
      onClick={action('clicked')}
    >
      ${buttonText}
    </Button>
  )
}
ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
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
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Button {...filteredProps}>
        {buttonText}
      </Button>
    </WithSource>
  );
}
