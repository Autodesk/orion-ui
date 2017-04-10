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
const valueSets = [
  { key: 'Tab', values: [9, 'Tab'] },
  { key: 'Enter', values: [13, 'Enter'] },
  { key: 'Escape', values: [27, 'Escape'] },
  { key: 'ArrowLeft', values: [37, 'ArrowLeft', 'Left'] },
  { key: 'ArrowUp', values: [38, 'ArrowUp', 'Up'] },
  { key: 'ArrowRight', values: [39, 'ArrowRight', 'Right'] },
  { key: 'ArrowDown', values: [40, 'ArrowDown', 'Down'] },
  { key: 'Backspace', values: [8, 'Backspace'] }
];

function match(valueSet, keyCode, key) {
  return valueSet.values.includes(keyCode) || valueSet.values.includes(key);
}

module.exports = function eventKey(event) {
  const matchingSet = valueSets.find(valueSet => {
    return match(valueSet, event.key, event.keyCode);
  });

  if (matchingSet === undefined) {
    return null;
  }
  return matchingSet.key;
};
