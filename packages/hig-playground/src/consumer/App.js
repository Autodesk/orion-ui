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
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Menu } from '../orion';
import * as HIG from '../orion/hig-react';

import WelcomeMessage from './containers/WelcomeMessage';

class App extends Component {
  handleItemClickRedux = item => {
    this.props.dispatch({ type: 'SELECT_ITEM', item });
  };

  handleToggleRedux = item => {
    this.props.dispatch({ type: 'TOGGLE_MENU' });
  };

  handleItemClickLocal = item => {
    this.setState(() => {
      return { selectedItem: item };
    });
  };

  constructor(props) {
    super();
    this.state = { selectedItem: null };
  }

  render() {
    const groups = [
      {
        id: 'group1',
        size: 'small',
        items: this.props.items
      },
      {
        id: 'group2',
        items: [{ id: 'item1', label: 'Other Group Item' }]
      }
    ];

    return (
      <div>
        <h1>Menu Controlled by Redux</h1>
        <div style={{ height: 200, width: '100%' }}>
          <Menu
            open={this.props.menuOpen}
            groups={groups}
            onItemClick={this.handleItemClickRedux}
            onToggle={this.handleToggleRedux}
            selectedItem={this.props.selectedItem}
          >
            <WelcomeMessage />
          </Menu>
        </div>
        <h1>Menu Controlled by Local State</h1>
        <div style={{ height: 200, width: '100%' }}>
          <Menu groups={groups} onItemClick={this.handleItemClickLocal}>
            <p>
              {(this.state.selectedItem && this.state.selectedItem.label) ||
                'Hello Main App Content!'}
            </p>
          </Menu>
        </div>
        <h1>Menu built with HIG.Web Primitives </h1>

        <div style={{ height: 200, width: '100%' }}>
          <HIG.Menu>
            <HIG.Menu.Top />
            <HIG.Menu.Sidebar open={true}>
              <HIG.Menu.Sidebar.Group small>
                <HIG.Menu.Sidebar.Item>Item 1</HIG.Menu.Sidebar.Item>
                <HIG.Menu.Sidebar.Item>Item 2</HIG.Menu.Sidebar.Item>
              </HIG.Menu.Sidebar.Group>
              <HIG.Menu.Sidebar.Group>
                <HIG.Menu.Sidebar.Item>Item 1</HIG.Menu.Sidebar.Item>
                <HIG.Menu.Sidebar.Item>Other Group Item</HIG.Menu.Sidebar.Item>
              </HIG.Menu.Sidebar.Group>
            </HIG.Menu.Sidebar>
            <HIG.Slot>
              <p>Hello Main App Content!</p>
            </HIG.Slot>
          </HIG.Menu>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    menuOpen: state.menuOpen,
    items: state.items,
    selectedItem: state.selectedItem
  };
};

export default connect(mapStateToProps)(App);
