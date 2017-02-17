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

gemini.suite('collapsed-select', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Select&selectedStory=collapsed')
    .setCaptureElements(".example")
    .capture('collapsed-select')
});

gemini.suite('expanded-select', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Select&selectedStory=expanded')
    .setCaptureElements(".example")
    .capture('expanded-select')
});

gemini.suite('option-focus-select', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Select&selectedStory=option%20focus')
    .setCaptureElements(".example")
    .capture('expanded-select')
});

gemini.suite('selected-index-select', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Select&selectedStory=selectedIndex')
    .setCaptureElements(".example")
    .capture('expanded-select')
});

gemini.suite('focus-select', (suite) => {
  suite
    .setUrl('iframe.html?selectedKind=Select&selectedStory=focus')
});

gemini.suite('scrolling-select', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Select&selectedStory=scrolling')
    .setCaptureElements(".example")
    .capture('expanded-select')
});

gemini.suite('disabled-select', (suite) => {
  suite
    .setUrl('iframe.html?selectedKind=Select&selectedStory=disabled')
    .setCaptureElements(".example")
    .capture('disabled-select')
});

gemini.suite('disabled-option', (suite) => {
  suite
    .setUrl('iframe.html?selectedKind=Select&selectedStory=disabled%20option')
    .setCaptureElements(".example")
    .capture('expanded-select')
});
