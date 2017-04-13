import React from 'react';
import { connect } from 'react-redux';

export class WelcomeMessage extends React.Component {
  render() {
    if (this.props.selectedItem) {
      return <div>{this.props.selectedItem.label} is selected</div>;
    } else {
      return <div>{this.props.welcomeMessage}</div>;
    }
  }
}

const mapStateToProps = state => {
  return {
    welcomeMessage: state.welcomeMessage,
    selectedItem: state.selectedItem
  };
};

export default connect(mapStateToProps)(WelcomeMessage);
