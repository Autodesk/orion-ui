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
  gemini.suite(`button-${name}`, (suite) => {
    suite
      .setUrl(url)
      .setCaptureElements(".example")
      .capture(name);
  });
}

gemini.suite('button', (suite) => {
  capture('default', '/iframe.html?selectedKind=Button&selectedStory=with%20text')
  capture('disabled', '/iframe.html?selectedKind=Button&selectedStory=disabled');
  capture('hover', 'iframe.html?selectedKind=Button&selectedStory=hover');
  capture('small', '/iframe.html?selectedKind=Button&selectedStory=small');
  capture('large', '/iframe.html?selectedKind=Button&selectedStory=large');
  capture('focus', 'iframe.html?selectedKind=Button&selectedStory=focus');
});
