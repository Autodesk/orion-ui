import React, { Component, PropTypes } from 'react';
import { Button } from '@orion-ui/react/lib/2016-12-01';

export default class Anchor extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    window.location.href = this.props.href;
  }

  render() {
    return <Button size="large" onClick={this.handleClick}>{this.props.children}</Button>
  }
}

Anchor.propTypes = {
  /**
   * The url to redirect to when clicked
   */
  href: PropTypes.string.isRequired
}
