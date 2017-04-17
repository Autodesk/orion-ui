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
import HIG, { Slot } from './hig-react';

class App extends React.Component {
  constructor() {
    super();
    this.state = { buttonLabel: 'Hello HIG', fn: false };
  }

  handleChange = event => {
    const buttonLabel = event.target.value;
    this.setState(() => {
      return { buttonLabel };
    });
  };

  fn1 = () => this.setState({ fn: true });

  fn2 = () => this.setState({ fn: false });

  render() {
    const actualFn = this.state.fn ? this.fn2 : this.fn1;

    return (
      <div>
        <HIG>
          <hig-button>{this.state.buttonLabel}</hig-button>
          <hig-menu>
            <hig-menu-top onToggle={actualFn} />
            <hig-sidebar open={this.state.fn}>
              <hig-sidebar-group small>
                <hig-sidebar-item>Item 1</hig-sidebar-item>
                <hig-sidebar-item onClick={actualFn}>
                  {this.state.buttonLabel}
                </hig-sidebar-item>
              </hig-sidebar-group>

              <hig-sidebar-group>
                <hig-sidebar-item>Other Group Item</hig-sidebar-item>
              </hig-sidebar-group>
            </hig-sidebar>
            <Slot>
              <p>Some DOM Content! {this.state.buttonLabel}</p>
            </Slot>
          </hig-menu>
        </HIG>
        <input
          type="text"
          value={this.state.buttonLabel}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
