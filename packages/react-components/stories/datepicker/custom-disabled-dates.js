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
import { boolean } from '@kadira/storybook-addon-knobs';

import Datepicker from '../../src/2016-12-01/datepicker';
import { WithSource } from '../../.storybook/addons/source-addon';

export default function customDisabledDates() {
  const staticDate = moment('2015-01-07');

  const isEnabled = function isEnabled(date) {
    const twoWeeksFromNow = moment(staticDate).add(2, 'weeks');
    if (date.isBefore(staticDate)) {
      return false;
    }

    if (date.isAfter(twoWeeksFromNow)) {
      return false;
    }

    return true;
  };

  const props = {
    focus: boolean('Focus', true)
  };

  const react = `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {Datepicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    constructor() {
        this.isEnabled = this.isEnabled.bind(this);
    }

    // Only enable dates in the next two weeks
    isEnabled(date) {
        const now = moment();
        const twoWeeksFromNow = moment().add(2, 'weeks');

        if (date.isBefore(now)) {
            return false;
        }

        if (date.isAfter(twoWeeksFromNow)) {
            return false;
        }

        return true;
    }

    render() {
        const date = moment();
        return <Datepicker date={date} focus={${props.focus}} isEnabled={this.isEnabled} />;
    }
}

ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
// app controller

import 'angular';
import * as moment from 'moment';
import '@orion-ui/angular/lib/2016-12-01';

angular.module('app', ['orion'])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.focus = ${props.focus};

    app.isEnabled(date) {
      const now = moment();
      const twoWeeksFromNow = moment().add(2, 'weeks');

      if (date.isBefore(now)) {
        return false;
      }

      if (date.isAfter(twoWeeksFromNow)) {
        return false;
      }

      return true;
    }

  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-datepicker date="{{app.date}}" focus="{{app.focus}}" isEnabled="{{app.isEnabled}}" />
  </body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Datepicker
        focusDate={staticDate}
        focus={props.focus}
        currentDate={staticDate}
        isEnabled={isEnabled}
      />
    </WithSource>
  );
}
