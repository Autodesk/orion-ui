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

import React from 'react';

module.exports = function FeaturesBenefits() {
  const features = [
    {
      title: 'HTML Components',
      body: 'Components are based on Web Component APIs at the core. This means they are compatible with any modern browser and framework.',
    },
    {
      title: 'React & Angular',
      body: 'Adapters are available out of the box. This means developers will not know they are using Web Components under the hood.',
    },
    {
      title: 'Rigorously Tested',
      body: 'All components have unit, integration, and visual regression tests baked in. All upgrades can be done without API breaks and knowing exactly how the components have changed.',
    },
    {
      title: 'Atoms',
      body: 'Instead of allowing arbitrary values our components take Atoms. This ensures consistency with the Autodesk Interface guidelines.',
    },
    {
      title: 'Flexible',
      body: 'If the underlying atomic values change, the designs will still look great!'
    }
  ];

  const featureNodes = features.map((feature) => {
    return (
      <li key={feature.title} className="w-100 w-40-m w-30-l mr3">
        <h3 className="f3">{feature.title}</h3>
        <p>{feature.body}</p>
      </li>
    );
  })

  return (
    <ul className="fx-row fx-w">
      {featureNodes}
    </ul>
  )
}
