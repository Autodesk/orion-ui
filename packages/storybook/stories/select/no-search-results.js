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
import { boolean, text } from '@kadira/storybook-addon-knobs';

import { Select } from '../../../react/lib/2016-12-01';
import { WithSource } from '../../addons/source-addon';

module.exports = function someSearchResults() {
  const props = {
    filter: text('Filter', 'd'),
    open: boolean('Open', true),
    options: [
      { value: 'one', label: 'One', key: 1 },
      { value: 'two', label: 'Two', key: 2 },
    ],
    searchable: boolean('Searchable', true),
  };

  const react = `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
render() {
  const options = ${JSON.stringify(props.options, null, 2)};

  return (
    <Select options={options} open={${props.open}} searchable={${props.searchable}} filter="${props.filter}" />
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
    app.sizes = ${JSON.stringify(props.options, null, 2)};
    app.searchable = ${props.searchable};
    app.open = ${props.searchable};
    app.filter = ${props.searchable};
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select options="app.options" open="app.open" searchable="app.searchable" filter="app.filter" />
</body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Select {...props} />
    </WithSource>
  );
};
