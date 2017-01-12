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

## Development on Orion

### Slack

For more immediate feedback, [sign up for our Slack](https://goo.gl/forms/565kU67pVHLt6rY52).

### Starter issues

If you have any questions, feel free to ask on the issue or join us on [Slack](https://goo.gl/forms/565kU67pVHLt6rY52)!

### Installation

1. Install [NodeJS](https://nodejs.org).
2. In the repo directory, run `npm i` command to install the required npm packages.
3. Run `npm i -g lerna@^2.0.0-beta` to install [Lerna](https://lernajs.io).
4. Run `npm run compile` - to compile all packages appropriately and put them in
their respective `lib` directories
5. Run `lerna bootstrap` to cross-link and install dependencies for each package.

### Build & Test

| Command          | Description                |
| ---------------- | -------------------------  |
| `lerna run test` | runs tests in each package |

### Manual testing

The below assume you ran `npm start` in a terminal.

#### Examples

The content in the `examples` directory can be reached at: http://localhost:8000/examples/

For each example there are 3 modes:

- `/examples/abc.html` points to prod. This file would not reflect your local changes.


## Repository Layout
<pre>
  packages/       - Top level packages which publish to npm go here
      orion-ui    - todo
  docs/           - documentation
  examples/       - example Orion projects
</pre>

## Supported browsers

In general we support the 2 latest versions of major browsers like Chrome, Firefox, Edge, Safari and Opera. We support desktop, phone, tablet and the web view version of these respective browsers.

Beyond that the core Orion library and elements should aim for very wide browser support and we accept fixes for all browsers with market share greater than 1 percent.

## Eng docs

- [Design Principles](DESIGN_PRINCIPLES.md)

## [Code of conduct](CODE_OF_CONDUCT.md)
