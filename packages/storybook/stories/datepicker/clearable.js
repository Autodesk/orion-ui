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

// import { Datepicker } from '../../../react/lib/2016-12-01';
import { WithSource } from '../../addons/source-addon';

export default function clearable() {
  const react = `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const date = moment();
        return <DatePicker date={date} focus={false} clearable={true} />;
    }
}

ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
// app controller

import 'angular';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.focus = false;
    app.clearable = true;
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-datepicker date="{{app.date}}" focus="{{app.focus}}" clearable="{{app.clearable}} />
  </body>
</html>
        `;

  return (
    <WithSource react={react} angular={angular}>
      <span>todo</span>
    </WithSource>
  );

}