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
import moment from 'moment';
import { select, text } from '@kadira/storybook-addon-knobs';

import Datepicker from '../../src/2016-12-01/datepicker';
import { WithSource } from '../../.storybook/addons/source-addon';

export default function customDateFormatting() {
  const props = {
    currentDate: moment('2014-12-01'),
    displayFormat: text('Display Format', 'ddd, hA'),
    focus: true,
    focusDate: moment('2014-12-01'),
    locale: select('Locale', ['zh-cn', 'en'], 'zh-cn'),
    monthFormat: text('Month Format', 'YYYY[年]MMMM')
  };

  const react = `
import React from 'react';
import moment from 'moment';
import {Datepicker} from '@orion-ui/react-components/lib/2016-12-01';

class App extends React.Component {
    render() {
        const date = moment();
        return (
          <Datepicker
            date={date}
            displayFormat="${props.displayFormat}"
            focus={true}
            locale={${props.locale}}
            monthFormat="${props.monthFormat}" />
        );
    }
}

ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
// app controller

import 'angular';
import moment from 'moment';
import 'moment/locale/zh-cn.js';
import '@orion-ui/angular/lib/2016-12-01';

angular.module('app', ['orion'])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.displayFormat = '${props.displayFormat}';
    app.locale = '${props.locale}';
    app.monthFormat = '${props.monthFormat}';
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-datepicker
      date="app.date"
      display-format="app.displayFormat"
      focus="true"
      locale="app.locale"
      month-format="app.monthFormat"
    />
  </body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Datepicker {...props} />
    </WithSource>
  );
}
