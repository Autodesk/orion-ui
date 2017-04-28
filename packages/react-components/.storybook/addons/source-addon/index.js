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
import React, { PropTypes } from 'react';
import addons from '@kadira/storybook-addons';

export class WithSource extends React.Component {
  render() {
    const { children, react, angular } = this.props;
    const channel = addons.getChannel();

    channel.emit('kadira/source/add_react', react);
    channel.emit('kadira/source/add_angular', angular);

    // return children;
    return children;
  }
}

WithSource.propTypes = {
  children: PropTypes.element.isRequired,
  react: PropTypes.string.isRequired,
  angular: PropTypes.string.isRequired,
};

export default WithSource;
