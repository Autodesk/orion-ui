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
const { ColorValidator, SizeValidator } = require('./validators');
require('@orion-ui/components/lib/2016-12-01/button');

// Use ng-disabled and ng-click
const ButtonDirective = ($log) => {
  const colorValidator = new ColorValidator();
  const sizeValidator = new SizeValidator();
  const configurable = ['color', 'background', 'size'];

  const validations = {
    color: colorValidator,
    background: colorValidator,
    size: sizeValidator,
  };

  return {
    restrict: 'E',

    scope: {
      state: '<',
    },

    link: (scope, element) => {
      const el = element[0];
      scope.$watchCollection('state', (value) => {
        configurable.forEach((prop) => {
          try {
            if (validations[prop]) {
              const validator = validations[prop];
              validator.valid(value[prop]);
            }
            el[prop] = value[prop];
          } catch (e) {
            $log.error(e);
          }
        });
      });
    },
  };
};

module.exports = ButtonDirective;
