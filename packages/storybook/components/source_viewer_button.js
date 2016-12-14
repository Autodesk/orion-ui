import React, { PropTypes } from 'react';

class SourceViewerButton extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick() {
    this.props.onClick(this.props.index);
  }

  render() {
    const style = {
      color: this.props.active ? 'blue' : null,
    };

    return <button style={style} onClick={this._handleClick}>{this.props.label}</button>;
  }
}

SourceViewerButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  active: PropTypes.bool,
};


export default SourceViewerButton;
