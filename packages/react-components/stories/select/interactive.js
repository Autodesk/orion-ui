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

import Select from '../../src/2016-12-01/select';
import { WithSource } from '../../.storybook/addons/source-addon';

export default function interactive() {
  const props = {
    options: [
      { value: 'one', label: 'One', key: 1 },
      { value: 'two', label: 'Two', key: 2 }
    ]
  };

  const react = `
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
    const options = ${JSON.stringify(props.options, null, 2)};

    return <Select {...this.state.selectState} options={options} onChange={this.onChange} />;
  }
}

ReactDOM.render(React.createElement(App), document.body);`;
  const angular = `
// app controller
import 'angular';
import {Select} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [Select.moduleName])
.controller('AppController', function() {
  var app = this;
  app.options = ${JSON.stringify(props.options, null, 2)};

  app.onChange = (event) => {
    if (event.detail.type === 'optionSelected') {
      // do something
    }
  }
});

// app.html

<!doctype html>
<html lang="en" ng-app="app">
<body ng-controller="AppController as app">
  <orion-select
    options="app.options"
    on-change="app.onChange" />
</body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Select {...props} />
    </WithSource>
  );
}
