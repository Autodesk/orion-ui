# [Orion](https://cdn.web-platform.io/orion-ui/orion/snapshot-master/index.html) &middot; [![CircleCI Status](https://circleci.com/gh/orion-ui/orion.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/orion-ui/orion) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/f77c37c58fe848399b0538c9e07ccd46)](https://www.codacy.com/app/orion-ui/orion?utm_source=github.com&utm_medium=referral&utm_content=orion-ui/orion&utm_campaign=Badge_Coverage) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

UI Components that work seamlessly in multiple UI frameworks

* **HTML Components** Components are based on Web Component APIs at the core. This means they are compatible with any modern browser and framework.

* **React & Angular 1.x** Adapters are available out of the box. This means developers will not know they are using Web Components under the hood.

* **Rigorously Tested** All components have unit, integration, and visual regression tests baked in. All upgrades can be done without API breaks and knowing exactly how the components have changed.

## Examples

We have several examples [on the website](https://cdn.web-platform.io/orion-ui/orion/snapshot-master/index.html). Here is a simple example of using Orion in React.js:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@orion-ui/react/lib/2016-12-01/button';

class HelloMessage extends React.Component {
  render() {
    return <div>Hello <Button>{this.props.name}</Button>;
  }
}

ReactDOM.render(
  <HelloMessage name="John" />,
  document.getElementById('container')
);
```

This example will render "Hello John" into the page and the button will be perfectly styled and look the same between any framework which uses an Orion button.

## Installation

Orion is available in a few different packages on npm:

* [`@orion-ui/react`](https://www.npmjs.com/package/@orion-ui/react) is the react library
* [`@orion-ui/angular`](https://www.npmjs.com/package/@orion-ui/angular) is the angular 1.x library
* [`@orion-ui/components`](https://www.npmjs.com/package/@orion-ui/components) is the vanilla web component library

We recommend using a bundler liked webpack or browserify to consume the orion libraries. See the [sample applications](https://cdn.web-platform.io/orion-ui/orion/snapshot-master/index.html) on the marketing site for fully functioning integrations.

## Contributing

The Orion project is meant to evolve with feedback - the project and its users greatly appreciate any thoughts on ways to improve the design or features. Read below to see how you can take part and contribute:

### Code of Conduct

Autodesk has adopted a Code of Conduct that we expect everyone who participates to adhere to. Please read [the full text](CODE_OF_CONDUCT.md) so that you can understand all the details.

### Contributing Guide

Read our [guide](CONTRIBUTING.md) to learn about the development process and how to work with the core team.

### License

Orion is [Apache-2.0 licensed](./LICENSE)