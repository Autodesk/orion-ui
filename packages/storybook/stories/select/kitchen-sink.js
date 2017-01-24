/* eslint-disable react/prop-types */
import React from 'react';
import { boolean, select, text } from '@kadira/storybook-addon-knobs';

import SourceViewer from '../../components/source_viewer';

module.exports = function kitchenSink() {
  const props = {
    open: boolean('Open', false),
    disabled: boolean('Disabled', true),
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
    searchable: boolean('Searchable', false),
    query: text('Query', 'Hello World'),
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
    <Select
      options={options}
      open={${props.open}}
      disabled={${props.disabled}}
      focusIndex={${props.focusIndex}}
      focus={${props.focus}}
      selectedIndex={${props.selectedIndex}}
      searchable={${props.searchable}}
      query="${props.query}"
      clearable={${props.clearable}} />
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
  app.query = "${props.query}"
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
    query="{{app.query}}"
    clearable="{{app.clearable}}" />
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
