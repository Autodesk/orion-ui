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
import { boolean, select, text } from '@kadira/storybook-addon-knobs';

import Select from '../../src/2016-12-01/select';
import { WithSource } from '../../.storybook/addons/source-addon';

export default function kitchenSink() {
  const props = {
    open: boolean('Open', false),
    disabled: boolean('Disabled', false),
    focusIndex: select('Focus Index', {
      undefined: 'undefined',
      0: '0',
      1: '1',
    }, 'undefined'),
    focus: boolean('Focus', true),
    selectedIndex: select('Selected Index', {
      undefined: 'undefined',
      0: '0',
      1: '1',
    }, 'undefined'),
    searchable: boolean('Searchable', true),
    filter: text('Filter', 'One'),
    clearable: boolean('Clearable', true),
    options: [
      { value: 'one', label: 'One', key: 1 },
      { value: 'two', label: 'Two', key: 2 },
    ],
  };

  const react = `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
render() {
  const options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  return (
    <Select
      options={options}
      open={${props.open}}
      disabled={${props.disabled}}
      focusIndex={${props.focusIndex}}
      focus={${props.focus}}
      selectedIndex={${props.selectedIndex}}
      searchable={${props.searchable}}
      filter="${props.filter}"
      clearable={${props.clearable}} />
  )
}
}

ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
// app controller
import 'angular';
import {SelectState, Select} from '@orion-ui/react/lib/2016-12-01/select';

angular.module('app', [Select.moduleName])
.controller('AppController', function() {
  var app = this;
  app.options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  app.open = ${props.open};
  app.disabled = ${props.disabled};
  app.focusIndex = ${props.focusIndex};
  app.focus = ${props.focus};
  app.selectedIndex = ${props.selectedIndex};
  app.searchable = ${props.searchable};
  app.filter = "${props.filter}"
  app.clearable = ${props.clearable};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select
    options="{{app.options}}"
    open="{{app.open}}"
    disabled="{{app.disabled}}"
    focusIndex="{{app.focusIndex}}"
    focus="{{app.focus}}"
    selectedIndex="{{app.selectedIndex}}"
    searchable="{{app.searchable}}"
    filter="{{app.filter}}"
    clearable="{{app.clearable}}" />
</body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Select {...props} />
    </WithSource>
  );
}
