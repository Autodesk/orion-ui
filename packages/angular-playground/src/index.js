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
import './vendor/custom-elements-polyfill';
import './index.css';

import 'angular';
import '@orion-ui/angular/lib/2016-12-01';

window.angular
  .module('app', ['orion'])
  .controller('Controller', function () {
    const app = this;

    app.options = [
      { value: 'one', label: 'One', key: 1 },
      { value: 'two', label: 'Two', key: 2 },
      { value: 'three', label: 'Three', key: 3 }
    ];
  });
