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

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Toggle Menu</button>
        <button onClick={this.handleAddItem}>Add Item</button>
        <button onClick={this.handleItemRemove}>Remove Last Item</button>

        <OrionHIG>
          <Menu>
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

            {/*<Menu.Slot>
              <div>
                TODO
              </div>
            </Menu.Slot>*/}
          </Menu>
        </OrionHIG>
      </div>
    );
  }
}

export default App;
