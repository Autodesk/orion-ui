<!---
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
-->

# Orion Design Principles

These design principles are meant to guide the ongoing design and development of Orion. They should help us make internally consistent decisions.

## User Experience > Developer Experience > Ease of Implementation.

When in doubt, do what’s best for the end user experience, even if it means that it’s harder for the page creator to build or for the library developer to implement.

## Components are the lowest common denominator

We believe that there will always be a new framework around the corner. Orion is designed originally for Autodesk where there are many front-end frameworks in use. We need to support the current and future UI frameworks.

## Modular distribution

Ensure that if a consumer opts to use only a small number of components they don't pay the price of all the components. Orion will someday have 100s of components and needs to keep an eye on that.

## TODO...
