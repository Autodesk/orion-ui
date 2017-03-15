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

import '../vendor/custom-elements-polyfill';

import 'tachyons';
import { Select } from '@orion-ui/react/lib/2016-12-01';
import React, { Component } from 'react';

import './App.css';
import Anchor from './components/anchor';
import constants from './constants';
import FeaturesBenefits from './components/features-benefits';
import GetStarted from './components/get-started';
import Nav from './components/nav';

class App extends Component {
  constructor() {
    super();

    this.state = { selectedIndex: 0 };

    this.setFramework = this.setFramework.bind(this);
  }

  setFramework(event) {
    this.setState({ selectedIndex: event.detail.state.selectedIndex });
  }

  render() {
    const frameworks = [
      { label: 'React', value: 'react', key: 1 },
      { label: 'Angular', value: 'angular', key: 2 },
    ];
    const selectedFramework = frameworks[this.state.selectedIndex].value;

    return (
      <div className="mw9 center ph4 pb6">
        <Nav />
        <div className="pv5">
          <h1 className="f1">Orion</h1>
          <p>UI Components that work seamlessly in multiple UI frameworks</p>
        </div>
        <div className="pv3 center w-20">
          <Anchor href={constants.storybookPath}>See All Components</Anchor>
        </div>
        <div className="pv3">
          <h2 className="f2">Get Started</h2>
          <div className="fx-row-l">
            <ol className="fx-g1">
              <li className="f4 pv3 fx-row fai-c">
                <span className="w-10 f1">1</span>
                Install the library for
                <span className="mr1"></span>
                <Select options={frameworks} selectedIndex={this.state.selectedIndex} onChange={this.setFramework} />
              </li>
              <li className="f4 pv3 fx-row fai-c">
                <span className="w-10 f1">2</span>
                Import a component
              </li>
              <li className="f4 pv3 fx-row fai-c">
                <span className="w-10 f1">3</span>
                Ready for production!
              </li>
            </ol>
            <GetStarted framework={selectedFramework} className="fx-g2" />
          </div>
        </div>
        <div>
          <h2 className="f2">Features & Benefits</h2>
          <FeaturesBenefits />
        </div>
        <div>
          <h2 className="f2">Sample Apps</h2>
          <table className="f6 w-100 mw8 center" cellspacing="0">
            <thead>
              <tr>
                <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Name</th>
                <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Description</th>
                <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Website</th>
                <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Source</th>
              </tr>
            </thead>
            <tbody className="lh-copy">
              <tr>
                <td className="pv3 pr3 bb b--black-20">React Minimal</td>
                <td className="pv3 pr3 bb b--black-20">Simple integration using <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a></td>
                <td className="pv3 pr3 bb b--black-20"><a href="https://orion-react-minimal.gomix.me">view site</a></td>
                <td className="pv3 pr3 bb b--black-20"><a href="https://gomix.com/#!/project/orion-react-minimal">view source</a></td>
              </tr>
              <tr>
                <td className="pv3 pr3 bb b--black-20">Angular Minimal</td>
                <td className="pv3 pr3 bb b--black-20">Simple integration example</td>
                <td className="pv3 pr3 bb b--black-20"><a href="https://orion-react-minimal.gomix.me">view site</a></td>
                <td className="pv3 pr3 bb b--black-20"><a href="https://gomix.com/#!/project/orion-angular-minimal2">view source</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
