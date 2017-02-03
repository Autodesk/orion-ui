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

gemini.suite('default-button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=with%20text')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
});

gemini.suite('disabled-button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=disabled')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
});

gemini.suite('hover-state-for-button', (suite) => {
  suite
    .setUrl('iframe.html?selectedKind=Button&selectedStory=hover%20state')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
});



gemini.suite('small-button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=small%20button')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
});

gemini.suite('large-button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=large%20button')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
});

gemini.suite('focus-button', (suite) => {
  suite
    .setUrl('iframe.html?selectedKind=Button&selectedStory=focus%20button')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
});
