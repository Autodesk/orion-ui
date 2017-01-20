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
const { BorderRadius, Container, Display, Hovers, Position, Skins, Spacing } = require('@orion-ui/style/lib/2016-12-01');

(function injectStyles() {
  if (!document.body) { return; }
  const styles = [BorderRadius, Container, Display, Hovers, Position, Skins, Spacing];
  let textContent = '';

  styles.forEach((style) => {
    textContent += style.css;
  });

  const element = window.document.createElement('style');
  element.textContent = textContent;
  window.document.body.appendChild(element);
}());
