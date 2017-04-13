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
