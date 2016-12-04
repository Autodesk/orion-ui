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

# Orion Versioning

## TL;DR

We don't break software. Orion can be grown and improved without
breaking backwards compatibility. We do that be establishing a three
level contract with two aspects **required** and **provided**. We then focus on **growing the software** via accretion, relaxation, and fixation. **BREAKING SOFTWARE changes will not be accepted**.

## What is required

1. function/component - arguments/properties
2. module - function names
3. package - module names

## What is provided

1. function/component - return value (procedure/effect)
2. module - functions/components
3. package - modules

When a change is made to the software we can describe the change as either **growing** or **breaking** based on the type of change and the level it was changed at.

## Growing software

* Accretion
  * Provide more
* Relaxation
  * Require less
* Fixation
  * Remove bugs
  * Improve performance

## Breaking software

* Require more
* Provide less
* Unrelated stuff under the same names

## Illustration 1: Growing vs Breaking modules

```
packages/
  orion-styles/
    index.js
    borders.js
    colors.js
```

```typescript
// orion-styles/index.js
export {default as borders} from './borders';
export {default as colors} from './colors';
```

orion-styles is a module with two exports, borders and colors. Think of a modules exports as a set based collection. In Sets additions are **growing** and deletions are **breaking**.

```typescript
orion-styles = new Set(['borders', 'colors']);
```

Adding a new module to orion-styles would be considered **growing**

```typescript
orion-styles.add('spacing');
```

Removing a module from orion-styles would be considered **breaking**

```typescript
orion-styles.delete('borders');
```

## Illustration 2: Removing a non-HIG compliant styles

Imagine our design team decides that *outline-buttons* are no longer Autodesk HIG compliant. How can we remove the outline-button safely?

```
packages/
  components/
    src/
        button.js
        outline-button.js
    2016-10-01/
      index.js

```

```
packages/
  components/
    src/
      button.js
      outline-button.js
    2016-10-01/
      index.js
    2016-10-02/
      index.js
```

We create a new 2016-10-02 folder with an index which links back to only the button. This means anyone who upgrades will have
the old button but not the outline-button. It also means that we can safely upgrade everyone to the latest version and they
can control when to remove the 'non-HIG' compliant styles.

```typescript
// components/2016-10-02/index.js
export {default as button} from '../src/button.js';
```