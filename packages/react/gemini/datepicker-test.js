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

function capture(name, url) {
  gemini.suite(`datepicker-${name}`, suite => {
    suite.setUrl(url).setCaptureElements('.example').capture(name);
  });
}

gemini.suite('datepicker', () => {
  capture(
    'unfocused-no-date',
    '/iframe.html?selectedKind=Datepicker&selectedStory=unfocused%20w%2Fo%20date'
  );
  capture(
    'unfocused-with-date',
    '/iframe.html?selectedKind=Datepicker&selectedStory=unfocused%20w%20date'
  );
  capture('focus', '/iframe.html?selectedKind=Datepicker&selectedStory=focus');
  capture(
    'focus-month-day',
    '/iframe.html?selectedKind=Datepicker&selectedStory=focus%20month%20%26%20day'
  );
  capture(
    'custom-disabled-dates',
    '/iframe.html?selectedKind=Datepicker&selectedStory=custom%20disabled%20dates'
  );
  capture(
    'custom-date-formatting',
    '/iframe.html?selectedKind=Datepicker&selectedStory=custom%20date%20formatting'
  );
  capture(
    'custom-placeholder-text',
    '/iframe.html?selectedKind=Datepicker&selectedStory=custom%20placeholder%20text'
  );
  capture(
    'clearable',
    '/iframe.html?selectedKind=Datepicker&selectedStory=clearable'
  );
});
