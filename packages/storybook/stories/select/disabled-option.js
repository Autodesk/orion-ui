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
import { boolean, select } from '@kadira/storybook-addon-knobs';

import { Select } from '../../../react/lib/2016-12-01';
import { WithSource } from '../../addons/source-addon';

export default function disabledOption() {
  const options = [
    { value: 'one', label: 'One', key: 1, disabled: boolean('Option 1 disabled', true) },
    { value: 'two', label: 'Two', key: 2, disabled: boolean('Option 2 disabled', false) },
  ];

  const props = {
    open: boolean('Open', true),
    options,
  };

  const react = `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
render() {
  const options = ${JSON.stringify(props.options, null, 2)}

  return <Select options={options} open={${props.open}} />;
}
}

ReactDOM.render(React.createElement(App), document.body);`;
  const angular = `
// app controller
import 'angular';
import '@orion-ui/angular/lib/2016-12-01';

angular
  .module('app', ['orion'])
  .controller('Controller', ['$scope', function ($scope) {
    $scope.open = true;
    $scope.sizes = [
      { label: 'One', value: 'one', key: 1, disabled: true },
      { label: 'Two', value: 'two', key: 2, disabled: false },
      { label: 'Three', value: 'three', key: 3 },
    ];
  }]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="Controller as ctrl">
  <orion-select options="sizes" open="open"></orion-select>
</body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Select options={options} open={props.open} />
    </WithSource>
  );
}
