/* eslint-disable react/prop-types */
import React from 'react';

import SourceViewer from '../../components/source_viewer';
import Example from '../../components/example';
import { Select } from '../../../react/lib/2016-12-01';

module.exports = function interactive() {
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
constructor(props) {
  super(props);

  this.state = {
    selectState: Select.State.create()
  };

  this.onChange = (event) => {
    if (event.type === 'selectedIndexChange') {
      // do something
    }

    this.setState({ selectState: event.state });
  }
}

render() {
  const options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  return <Select {...this.state.selectState} options={options} onChange={this.onChange} />;
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
import {Select} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [Select.moduleName])
.controller('AppController', function() {
  var app = this;
  app.options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  app.selectState = Select.State.create();

  app.onChange = (event) => {
    if (event.type === 'selectedIndexChange') {
      // do something
    }

    app.selectState = event.state;
  }
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select
    options="{{app.options}}"
    selectState="{{app.selectState}}"
    ng-change="app.onChange(selectState)" />
</body>
</html>
      `,
    },
  ];

  return (
    <div>
      <Example>
        <Select options={options} />
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
};
