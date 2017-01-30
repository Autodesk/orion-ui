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

import '@orion-ui/angular/lib/2016-12-01';

angular
  .module('app', ['orion'])
  .controller('Controller', ['$scope', function($scope) {
    var that = this;

    $scope.buttons = [
      { label: 'Large white on black', color: 'white', background: 'black', size: 'large' },
      { label: 'Black on grey', color: 'black', background: 'grey' },
      { label: 'White on blue', color: 'white', background: 'blue', size: 'small' },
    ];

    that.handleClick = () => {
      alert('button clicked!');
    }

    this.toggleDisability = () => {
      $scope.buttons.forEach((button) => {
        button.disabled = !button.disabled;
      });
    }

    this.embiggen = () => {
      $scope.buttons.forEach((button) => {
        button.size = 'large';
      });      
    }
  }]);
