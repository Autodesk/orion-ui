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

import '../vendor/custom-elements-polyfill';
import '@orion-ui/angular/lib/2016-12-01';
import moment from 'moment';

angular
  .module('app', ['orion'])
  .controller('Controller', ['$scope', function ($scope) {
    var that = this;

    $scope.clearable = true;
    $scope.sizes = [
      { label: 'X-small', value: 'x-small', key: 0, disabled: true },
      { label: 'Small', value: 'small', key: 1 },
      { label: 'Medium', value: 'medium', key: 2 },
      { label: 'Large', value: 'large', key: 3 },
      { label: 'X-Large', value: 'x-large', key: 4, disabled: true },
    ];

    this.setSelectedIndex = (event) => {
      $scope.selectedIndex = event.detail.state.selectedIndex;
    }

  }]);
