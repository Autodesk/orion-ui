/* eslint-disable react/prop-types */
import React from 'react';
import { boolean } from '@kadira/storybook-addon-knobs';

import SourceViewer from '../../components/source_viewer';
import Example from '../../components/example';
import { Select } from '../../../react/lib/2016-12-01';

module.exports = function collapsed() {
  const props = {
    open: boolean('Open', false),
  };
  const options = [
    { value: 'one', label: 'One', key: 1 },
    { value: 'two', label: 'Two', key: 2 },
  ];

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
    { value: 'one', label: 'One', key: 1 },
    { value: 'two', label: 'Two', key: 2 }
  ];

  return <Select options={options} open={${props.open}} />;
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
    { value: 'one', label: 'One', key: 1 },
    { value: 'two', label: 'Two', key: 2 }
  ];

  app.open = ${props.open};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select options="{{app.options}}" open="{{app.open}}"  />
</body>
</html>
      `,
    },
  ];

  return (
    <div>
      <Example>
        <Select options={options} open={props.open} />
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
};
