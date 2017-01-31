import 'tachyons';
import React, { Component } from 'react';
import '../vendor/custom-elements-polyfill';
import { Button, Select } from '@orion-ui/react/lib/2016-12-01';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = { framework: 'react' };

    this.setFramework = this.setFramework.bind(this);
  }

  setFramework() {

  }

  render() {
    const frameworks = [
      { label: 'React', value: 'react', key: 1 },
      { label: 'Angular', value: 'angular', key: 2 },
    ];

    return (
      <div>
        <div className="sp5">
          <h1 className="f1">Orion</h1>
          <p>A resusable, HIG compliant, UI component library for Autodesk applications based on web standards and open source best pracices.</p>
        </div>
        <div className="sp5">
          <Button>See All Components</Button>
        </div>
        <div>
          <h2 className="f2">Get Started</h2>
          <ol>
            <li>
              Install the library for
              <Select options={frameworks} onChange={this.setFramework} />
            </li>
            <li>Import a component</li>
            <li>Ready for production!</li>
          </ol>
        </div>
      </div>
    );
  }
}

export default App;
