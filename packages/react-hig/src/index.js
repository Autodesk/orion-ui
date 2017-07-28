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
import ReactDOM from 'react-dom';
import { GlobalNav, FilterableSideNav } from './react-hig';

import 'hig.web/dist/hig.css';
import './index.css';

import logo from './images/bim-logo.png';
import profileImage from './images/profileImage.png';

const links = [
  { title: 'Autodesk Main', url: 'http://www.autodesk.com' },
  {
    title: 'AutoCAD',
    url: 'https://www.autodesk.com/products/autocad/overview'
  },
  { title: 'Maya', url: 'https://www.autodesk.com/products/maya/overview' }
];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      sideNavOpen: true,
      query: '',
      items: {
        links: [
          { title: 'Autodesk Main', url: 'http://www.autodesk.com' },
          {
            title: 'AutoCAD',
            url: 'https://www.autodesk.com/products/autocad/overview'
          },
          {
            title: 'Maya',
            url: 'https://www.autodesk.com/products/maya/overview'
          }
        ]
      }
    };
  }

  toggleSidenav = () => {
    this.setState({ sideNavOpen: !this.state.sideNavOpen });
  };

  render() {
    return (
      <GlobalNav sideNavOpen={this.state.sideNavOpen}>
        <FilterableSideNav items={this.state.items} />
      </GlobalNav>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
