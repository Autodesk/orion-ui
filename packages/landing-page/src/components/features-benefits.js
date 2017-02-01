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
