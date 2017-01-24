/* eslint-disable react/prop-types */
import React from 'react';
import { boolean, number } from '@kadira/storybook-addon-knobs';

import SourceViewer from '../../components/source_viewer';

module.exports = function selectedIndex() {
  const props = {
    open: boolean('Open', false),
    selectedIndex: number('Selected Index', 0, {
      range: true,
      min: 0,
      max: 1,
      step: 1,
    }),
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
    <Select options={options} open={${props.open}} selectedIndex={${props.selectedIndex}} />
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
  app.selectedIndex = ${props.selectedIndex};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select options="{{app.options}}" open="{{app.open}}" selectedIndex="{{app.selectedIndex}}" />
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
