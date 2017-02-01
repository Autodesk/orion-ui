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

const { Skins } = require('@orion-ui/style/lib/2016-12-01');

const colors = Object.keys(Skins.colors);
const sizes = ['small', 'medium', 'large'];

function ValidationException(message) {
  this.name = 'ValidationException';
  this.message = message;
  this.toString = () => {
    return `[${this.name}] ${this.message}`;
  };
}

function InclusionValidator(name, validValues) {
  this.valid = (val) => {
    if (validValues.includes(val)) {
      return true;
    }

    const errMsg = `Invalid ${name}: ${val}. Must be one of: ${validValues.join(', ')}.`;
    throw new ValidationException(errMsg);
  };
}

function ColorValidator() {
  return new InclusionValidator('color', colors);
}

function SizeValidator() {
  return new InclusionValidator('size', sizes);
}

module.exports = { ColorValidator, SizeValidator };
