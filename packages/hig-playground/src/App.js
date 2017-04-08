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

class App extends Component {
  constructor() {
    super();
    this.state = {
      menuOpen: false,
      lastItemId: 3,
      items: [
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' }
      ]
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }

  handleClick() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleAddItem() {
    const nextId = this.state.lastItemId + 1;
    const newItem = { id: nextId, label: `Item ${nextId}` };
    this.setState({ items: [...this.state.items, newItem], lastItemId: nextId });
  }

  handleItemClick(item) {
    const i = this.state.items.indexOf(item);
    const oldItems = [...this.state.items];
    oldItems[i].label = new Date().toString();
    this.setState({ items: oldItems });
  }

  handleItemRemove() {
    const newItems = [...this.state.items];

    newItems.splice(this.state.items.length - 1, 1);

    this.setState({ items: newItems });
  }

  handleMenuToggle() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        {/*<button onClick={this.handleClick}>Toggle Menu</button>
        <button onClick={this.handleAddItem}>Add Item</button>
        <button onClick={this.handleItemRemove}>Remove Last Item</button>*/}
        <OrionHIG>
          <Menu>
            <Menu.Top onToggle={this.handleMenuToggle} />
            <Sidebar open={this.state.menuOpen}>
              <Sidebar.Group small>
                {this.state.items.map(item => {
                  return <Sidebar.Item key={item.id} onClick={() => this.handleItemClick(item)}>{item.label}</Sidebar.Item>
                }
                )}
              </Sidebar.Group>

              <Sidebar.Group>
                <Sidebar.Item>Item 3</Sidebar.Item>
              </Sidebar.Group>
            </Sidebar>

            <Menu.Slot>
              Hello Main App Content!
            </Menu.Slot>
          </Menu>
        </OrionHIG>
      </div>
    );
  }
}

export default App;
