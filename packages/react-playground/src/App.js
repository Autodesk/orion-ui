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
import {Button} from '@orion-ui/react/lib/2016-12-01';
import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInverted: false
    }
    this.invertButton = this.invertButton.bind(this);
  }

  invertButton() {
    this.setState({ isInverted: !this.state.isInverted });
  }

  buttonProps() {
    if (this.state.isInverted) {
      return { background: 'black', color: 'white' }
    } else {
      return { background: 'white', color: 'black' }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <Button {...this.buttonProps()} onClick={this.invertButton}>Hello, Button!</Button>
        </p>
      </div>
    );
  }
};

export default App;
