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

import SourceViewer from '../../components/source_viewer';

module.exports = function noSearchResults() {
  const props = {
    searchable: boolean('Searchable', true),
    // query text makes the select open
    query: text('Query', 'Hello World'),
  };

  const sources = [
    {
      label: 'React',
      source: `
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
    <Select options={options} searchable={${props.searchable}} query="${props.query}" />
  )
}
}

ReactDOM.render(React.createElement(App), document.body);
      `,
    },
    {
      label: 'Angular 1.5.x',
      source: `
// app controller
import 'angular';

angular.module('app', [])
.controller('AppController', function() {
  var app = this;
  app.options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  app.open = ${props.open};
  app.searchable = ${props.searchable};
  app.query = "${props.query}";
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select options="{{app.options}}" searchable="{{app.searchable}}" query="{{app.query}}" />
</body>
</html>
      `,
    },
  ];

  return (
    <div>
      <SourceViewer sources={sources} />
    </div>
  );
};
