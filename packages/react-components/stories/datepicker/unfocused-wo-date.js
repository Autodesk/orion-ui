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

import Datepicker from '../../src/2016-12-01/datepicker';
import { WithSource } from '../../.storybook/addons/source-addon';

export default function unfocusedWoDate() {
  const react = `
import React from 'react';
import {Datepicker} from '@orion-ui/react-components/lib/2016-12-01';

class App extends React.Component {
    render() {
        return <Datepicker date={null} focus={false} />;
    }
}

ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
// app controller

import 'angular';
import '@orion-ui/angular/lib/2016-12-01';

angular.module('app', ['orion'])
  .controller('AppController', function() {
    var app = this;
    app.date = null;
    app.focus = false;
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-datepicker date="app.date" focus="app.focus" />
  </body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Datepicker />
    </WithSource>
  );
}
