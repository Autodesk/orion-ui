import React, { PropTypes } from 'react';

const Button = function Button(props) {
  const styles = {
    color: props.color,
    backgroundColor: props.backgroundColor,
  };

  return <button style={styles} onClick={props.onClick}>{props.children}</button>;
};

Button.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Button;
