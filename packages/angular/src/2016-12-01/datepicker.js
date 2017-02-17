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
require('@orion-ui/components/lib/2016-12-01/datepicker');
const applyProps = require('@orion-ui/components/lib/utils/apply-props');

const configurable = [];

const DatepickerComponent = {
  bindings: {
    onChange: '&',
  },

  controller: function controller($element, $log) { // eslint-disable object-shorthand
    const elementReady = window.customElements.whenDefined('orion-datepicker');

    this.$onInit = () => elementReady.then(() => {
      $element[0].addEventListener('change', (event) => {
        applyProps($element[0], event.detail.state);
        this.onChange({ event });
      });
    });

    this.$onChanges = changesObj => elementReady.then(() => {
      const el = $element[0];
      const props = Object.keys(changesObj);
      props.forEach((prop) => {
        try {
          if (!configurable.includes(prop)) {
            return;
          }

          if (changesObj[prop].currentValue === undefined) {
            return;
          }

          const newVal = changesObj[prop].currentValue;

          el[prop] = newVal;
        } catch (e) {
          $log.error(e);
        }
      });
    });
  },
};

module.exports = DatepickerComponent;
