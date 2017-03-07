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
module.exports = function injectStyleTag(id, style) {
  let scriptTag = document.body.querySelector(`[data-orion-id=${id}]`);
  if (scriptTag) { console.log('we already created that style tag though'); return; }

  console.log('creating a style tag');
  scriptTag = document.createElement('style');
  scriptTag.textContent = style;
  scriptTag.setAttribute('data-orion-id', id);
  document.body.appendChild(scriptTag);
};
