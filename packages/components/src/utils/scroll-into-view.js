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
module.exports = function scrollIntoView(element) {
  const parent = element.parentElement;

  const showChildAtTop = element.offsetTop;
  const isChildAboveScrollView = parent.scrollTop > element.offsetTop;
  if (isChildAboveScrollView) {
    parent.scrollTop = showChildAtTop;
    return;
  }

  const showChildAtBottom = (element.offsetTop - parent.clientHeight) + element.offsetHeight;
  const isChildBelowScrollView = parent.scrollTop < showChildAtBottom;
  if (isChildBelowScrollView) {
    parent.scrollTop = showChildAtBottom;
  }
};
