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
  gemini.suite(`select-${name}`, (suite) => {
    suite
      .setUrl(url)
      .setCaptureElements(".example")
      .capture(name);
  });
}

gemini.suite('select', (suite) => {
  capture('collapsed', 'iframe.html?selectedKind=Select&selectedStory=collapsed');
  capture('expanded', 'iframe.html?selectedKind=Select&selectedStory=expanded');
  capture('option-focus', 'iframe.html?selectedKind=Select&selectedStory=option%20focus');
  capture('selected-index', 'iframe.html?selectedKind=Select&selectedStory=selectedIndex');
  capture('focus', 'iframe.html?selectedKind=Select&selectedStory=focus');
  capture('scrolling', 'iframe.html?selectedKind=Select&selectedStory=scrolling');
  capture('disabled', 'iframe.html?selectedKind=Select&selectedStory=disabled');
  capture('disabled-option', 'iframe.html?selectedKind=Select&selectedStory=disabled%20option');
  capture('no-search-results', 'iframe.html?selectedKind=Select&selectedStory=no%20search%20results');
  capture('some-search-results', 'iframe.html?selectedKind=Select&selectedStory=some%20search%20results');
  capture('clearable', 'iframe.html?selectedKind=Select&selectedStory=clearable');
});
