import React from 'react';
import { Menu as HIGMenu, Slot } from './hig-react';

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
