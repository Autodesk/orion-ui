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
import { Menu as HIGMenu, Slot } from '@orion-ui/react-hig';

export class Menu extends React.Component {
  static defaultProps = {
    showTop: true,
    groups: [],
    onItemClick: () => {
      /* no-op */
    },
    onToggle: () => {
      /* no-op */
    }
  };

  handleMenuToggle = () => {
    this.setState(prevState => {
      return {
        open: this.getOpenPorS(!prevState.open)
      };
    });

    this.props.onToggle();
  };

  handleItemClick = (item, group) => {
    this.setState(() => {
      return { selectedItem: this.getSelectedItemPorS(item) };
    });
    this.props.onItemClick(item, group);
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.selectedItem,
      open: props.open
    };
  }

  getOpenPorS(val) {
    if (this.props.hasOwnProperty('open')) {
      return this.props.open;
    } else {
      return val;
    }
  }

  getSelectedItemPorS(val) {
    if (this.props.hasOwnProperty('selectedItem')) {
      return this.props.selectedItem;
    } else {
      return val;
    }
  }

  render() {
    return (
      <HIGMenu>
        {this.props.showTop && <HIGMenu.Top onToggle={this.handleMenuToggle} />}

        <HIGMenu.Sidebar open={this.getOpenPorS(this.state.open)}>
          {this.props.groups.map(group => (
            <HIGMenu.Sidebar.Group
              key={group.id}
              small={group.size === 'small'}
            >
              {group.items.map(item => {
                const props = {
                  onClick: () => this.handleItemClick(item, group),
                  selected: this.getSelectedItemPorS(
                    this.state.selectedItem
                  ) === item
                };

                return (
                  <HIGMenu.Sidebar.Item key={item.id} {...props}>
                    {item.label}
                  </HIGMenu.Sidebar.Item>
                );
              })}
            </HIGMenu.Sidebar.Group>
          ))}
        </HIGMenu.Sidebar>

        <Slot>
          {this.props.children}
        </Slot>
      </HIGMenu>
    );
  }
}
