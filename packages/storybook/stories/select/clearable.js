/* eslint-disable react/prop-types */
import React from 'react';
import { boolean } from '@kadira/storybook-addon-knobs';

import SourceViewer from '../../components/source_viewer';

module.exports = function clearable() {
  const props = {
    clearable: boolean('Clearable', true),
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
    <Select options={options} selectedIndex={1} clearable={${props.clearable}} />
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

  app.selectedIndex = 1;
  app.clearable = ${props.clearable};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select options="{{app.options}}" selectedIndex="{{app.selectedIndex}}" clearable="{{app.clearable}}" />
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
