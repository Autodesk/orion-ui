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
import moment from 'moment';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      isEnabled: false,
      selectedIndex: undefined,
      localeIndex: 0,
      displayFormat: 'Do MMMM, YYYY',

      buttonSizes: [
        { label: 'X-small', value: 'x-small', key: 0, disabled: true },
        { label: 'Small', value: 'small', key: 1 },
        { label: 'Medium', value: 'medium', key: 2 },
        { label: 'Large', value: 'large', key: 3 },
        { label: 'X-Large', value: 'x-large', key: 4, disabled: true },
      ]
    };

    ['setDate', 'setDisplayFormat', 'setLocale', 'setSelectedIndex', 'handleClick', 'toggleDisabled', 'isEnabled', 'handleIsEnabled'].forEach((fn) => {
      this[fn] = this[fn].bind(this);
    });

    this.locales = [
      { label: 'English', value: 'en', key: 1 },
      { label: 'Chinese', value: 'zh-cn', key: 2 },
    ];

    this.i18n = {
      'zh-cn': {
          "previousMonth": "前一个月",
          "nextMonth": "下个月",
          "clearDate": "清除日期"
      },
      'en': {
        "previousMonth": "Previous Month",
        "nextMonth": "Next Month",
        "clearDate": "Clear Date"
      }
    }
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

  setDate(event) {
    this.setState({ date: event.detail.state.date });
  }

  handleIsEnabled(event) {
    this.setState({ isEnabled: event.target.checked });
  }

  isEnabled(date) {
    const now = moment();
    const twoWeeksFromNow = moment().add(2, 'weeks');
    const twoDaysFromNow = moment().add(2, 'days');
    const oneDayFromNow = moment().add(1, 'day');

    if (date.isBefore(now, 'day')) {
      return false;
    }

    if (date.isSame(twoDaysFromNow, 'day')) {
      return false;
    }

    if (date.isSame(oneDayFromNow, 'day')) {
      return false;
    }

    if (date.isAfter(twoWeeksFromNow)) {
      return false;
    }
    return true;
 } 


  setLocale(event) {
    const selectedOption = this.locales[event.detail.state.selectedIndex];
    if (selectedOption === undefined) { return; }

    this.setState({
      locale: selectedOption.value,
      localeIndex: event.detail.state.selectedIndex,
      i18n: this.i18n[selectedOption.value],
    });
  }

  setDisplayFormat(event) {
    this.setState({ displayFormat: event.detail.state.value });
  }

  render() {
    let selectedSize;
    const selectedOption = this.state.buttonSizes[this.state.selectedIndex];
    if (selectedOption !== undefined) {
      selectedSize = selectedOption.value;
    }

    const props = {
      clearable: true,
      i18n: this.state.i18n,
      date: this.state.date,
      locale: this.state.locale,
      displayFormat: this.state.displayFormat,
      monthFormat: "MMMM YYYY",
      onChange: this.setDate
    }

    if (this.state.isEnabled) {
      props.isEnabled = this.isEnabled;
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div style={{ margin: '40px' }}>
          <h3>Button</h3>
          <Select clearable searchable disabled={this.state.disabled} options={this.state.buttonSizes} selectedIndex={this.state.selectedIndex} onChange={this.setSelectedIndex}/>
          <button onClick={this.toggleDisabled}>Toggle disabled</button>
          <button onClick={this.toggleDisabledOption}>Toggle disabled option</button>
        </div>
        <div>
          <Button size={selectedSize} disabled={this.state.disabled} onClick={this.handleClick}>Hello, Button!</Button>
        </div>
        <div style={{ margin: '40px' }}>
          <h3>Date Picker</h3>
          <div style={{ margin: '40px' }}>
            <input clearable value={this.state.displayFormat} onChange={this.setDisplayFormat} placeholder="Display format"/>
            <Select options={this.locales} selectedIndex={this.state.localeIndex} onChange={this.setLocale}/>
          </div>
          <Datepicker {...props} ></Datepicker>
          <label>Custom isEnabled: <input type="checkbox" value={this.state.isEnabled} onChange={this.handleIsEnabled} /></label>
        </div>
      </div>
    );
  }
};

export default App;
