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
