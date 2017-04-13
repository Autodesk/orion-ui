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
import React, { Component } from 'react';
import './App.css';
import { OrionHIG, Menu, Sidebar } from './Orion';
import WelcomeMessage from './containers/WelcomeMessage';
import { connect } from 'react-redux';

class App extends Component {
  handleItemClick = item => {
    this.props.dispatch({ type: 'SELECT_ITEM', item });
  };

  handleMenuToggle = () => {
    this.props.dispatch({ type: 'TOGGLE_MENU' });
  };

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <OrionHIG>
          <Menu>
            <Menu.Top onToggle={this.handleMenuToggle} />

            <Sidebar open={this.props.menuOpen}>
              <Sidebar.Group small>
                {this.props.items.map(item => {
                  const props = {
                    key: item.id,
                    onClick: () => this.handleItemClick(item),
                    selected: this.props.selectedItem === item
                  };
                  return <Sidebar.Item {...props}>{item.label}</Sidebar.Item>;
                })}
              </Sidebar.Group>

              <Sidebar.Group>
                <Sidebar.Item onClick={() => alert('do something unique!')}>
                  Other Group Item
                </Sidebar.Item>
              </Sidebar.Group>
            </Sidebar>

            <Menu.Slot>
              <WelcomeMessage />
            </Menu.Slot>
          </Menu>
        </OrionHIG>
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
