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
import { boolean } from '@kadira/storybook-addon-knobs';

import Select from '../../src/2016-12-01/select';
import { WithSource } from '../../.storybook/addons/source-addon';

export default function disabled() {
  const props = {
    disabled: boolean('Disabled', true),
    options: [
      { value: 'one', label: 'One', key: 1 },
      { value: 'two', label: 'Two', key: 2 }
    ]
  };

  const react = `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react-components/lib/2016-12-01';

class App extends React.Component {
render() {
  const options = ${JSON.stringify(props.options, null, 2)};

  return (
    <Select options={options} disabled={${props.disabled}} />
  )
}
}

ReactDOM.render(React.createElement(App), document.body);`;
  const angular = `
// app controller
import 'angular';
import '@orion-ui/angular/lib/2016-12-01';

angular
  .module('app', ['orion'])
  .controller('AppController', function () {
    var app = this;
    app.disabled = ${props.disabled};
    app.options = ${JSON.stringify(props.options, null, 2)};
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select options="app.options" disabled="app.disabled"></orion-select>
</body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Select {...props} />
    </WithSource>
  );
}
