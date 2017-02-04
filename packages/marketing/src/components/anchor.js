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
