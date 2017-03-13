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
import { object } from '@kadira/storybook-addon-knobs';

import { Datepicker } from '../../../react/lib/2016-12-01';
import { WithSource } from '../../addons/source-addon';

export default function i18n() {
  const props = {
    date: moment('2016-06-28'),
    focus: true,
    focusDate: moment('2016-06-28'),
    i18n: object('Phrases', {
      previousMonth: '前一个月',
      nextMonth: '下个月',
      clearDate: '清除日期',
    }),
  };

  const react = `
import React from 'react';
import moment from 'moment';
import {Datepicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const i18n = ${JSON.stringify(props.i18n, null, 10)};
        const date = moment();
        return <Datepicker date={date} focus={true} i18n={i18n}  />;
    }
}

ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
// app controller

import 'angular';
import moment from 'moment';
import '@orion-ui/angular/lib/2016-12-01';

angular.module('app', ['orion'])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.i18n = ${JSON.stringify(props.i18n, null, 10)};
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-datepicker focus="true" date="app.date" i18n="app.i18n" />
  </body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Datepicker {...props} />
    </WithSource>
  );
}
