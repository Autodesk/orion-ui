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
import HIG, { Menu, Slot, Button } from './hig-react';

class App extends React.Component {
  constructor() {
    super();
    this.state = { buttonLabel: 'Hello HIG' };
  }

  handleChange = event => {
    const buttonLabel = event.target.value;
    this.setState(() => {
      return { buttonLabel };
    });
  };

  render() {
    return (
      <div>
        <HIG>
          <Button onClick={() => alert('on click!')}>My button</Button>
          <Menu>
            <Slot>
              <p>Some DOM Content!</p>
            </Slot>
          </Menu>
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
