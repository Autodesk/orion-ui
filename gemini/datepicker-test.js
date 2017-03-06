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

gemini.suite('datepicker-unfocused-no-date', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Datepicker&selectedStory=unfocused%20w%2Fo%20date')
    .setCaptureElements(".example")
    .capture('datepicker-unfocused-no-date')
});

gemini.suite('datepicker-unfocused-with-date', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Datepicker&selectedStory=unfocused%20w%20date')
    .setCaptureElements(".example")
    .capture('datepicker-unfocused-with-date')
});

gemini.suite('datepicker-focused', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Datepicker&selectedStory=focus')
    .setCaptureElements(".example")
    .capture('datepicker-focused')
});

gemini.suite('datepicker-focused-month-day', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Datepicker&selectedStory=focus%20month%20%26%20day')
    .setCaptureElements(".example")
    .capture('datepicker-focused-month-day')
});

gemini.suite('datepicker-custom-disabled-dates', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Datepicker&selectedStory=custom%20disabled%20dates')
    .setCaptureElements(".example")
    .capture('datepicker-custom-disabled-dates')
});

gemini.suite('datepicker-custom-date-formatting', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Datepicker&selectedStory=custom%20date%20formatting')
    .setCaptureElements(".example")
    .capture('datepicker-custom-date-formatting')
});

gemini.suite('datepicker-custom-placeholder-text', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Datepicker&selectedStory=custom%20placeholder%20text')
    .setCaptureElements(".example")
    .capture('datepicker-custom-placeholder-text')
});
