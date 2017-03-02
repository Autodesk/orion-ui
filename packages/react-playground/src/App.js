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
import { Button, Select, Datepicker } from '@orion-ui/react/lib/2016-12-01';
import React from 'react';
import logo from './logo.svg';
import './App.css';

import moment from 'moment'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      isEnabled: false,
      selectedIndex: undefined,

      buttonSizes: [
        { label: 'X-small', value: 'x-small', key: 0, disabled: true },
        { label: 'Small', value: 'small', key: 1 },
        { label: 'Medium', value: 'medium', key: 2 },
        { label: 'Large', value: 'large', key: 3 },
        { label: 'X-Large', value: 'x-large', key: 4, disabled: true },
      ]
    };

    ['setSelectedIndex', 'handleClick', 'toggleDisabled', 'toggleDisabledOption', 'isEnabled', 'handleIsEnabled'].forEach((fn) => {
      this[fn] = this[fn].bind(this);
    });
  }

  handleClick() {
    alert('Clicked it.');
  }

  toggleDisabled() {
    this.setState({ disabled: !this.state.disabled });
  }

  toggleDisabledOption() {
    const buttonSizes = this.state.buttonSizes;
    buttonSizes[0].disabled = !buttonSizes[0].disabled;
    this.setState({ buttonSizes });
  }

  setSelectedIndex(event) {
    this.setState({ selectedIndex: event.detail.state.selectedIndex });
  }

  handleIsEnabled(event) {
    this.setState({ isEnabled: event.target.checked });
  }

  isEnabled(date) {
    const now = moment();
    const twoWeeksFromNow = moment().add(2, 'weeks');

    if (date.isBefore(now)) {
      return false;
    }

    if (date.isAfter(twoWeeksFromNow)) {
      return false;
    }

    return true;
  }

  render() {
    let selectedSize;
    const selectedOption = this.state.buttonSizes[this.state.selectedIndex];
    if (selectedOption !== undefined) {
      selectedSize = selectedOption.value;
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div style={{ margin: '40px' }}>
          <input />
          <Select disabled={this.state.disabled} options={this.state.buttonSizes} selectedIndex={this.state.selectedIndex} onChange={this.setSelectedIndex} />
          <button onClick={this.toggleDisabled}>Toggle disabled</button>
          <button onClick={this.toggleDisabledOption}>Toggle disabled option</button>
        </div>
        <div>
          {this.state.isEnabled &&
            <Datepicker isEnabled={this.isEnabled}></Datepicker>
          }

          {!this.state.isEnabled &&
            <Datepicker></Datepicker>
          }
          <label>Custom isEnabled: <input type="checkbox" value={this.state.isEnabled} onChange={this.handleIsEnabled} /></label>
        </div>
        <div>
          <Button size={selectedSize} disabled={this.state.disabled} onClick={this.handleClick}>Hello, Button!</Button>
        </div>
      </div>
    );
  }
};

export default App;
