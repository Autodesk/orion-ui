
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
require('@orion-ui/components/lib/2016-12-01/button');

const React = require('react');
const { Skins } = require('@orion-ui/style/lib/2016-12-01');
const ButtonState = require('@orion-ui/components/lib/2016-12-01/button-state.js');

const PropTypes = React.PropTypes;

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateState = this.updateState.bind(this);
    this.registerListeners = this.registerListeners.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setProperties(this.state.el, nextProps);
  }

  setProperties(el, properties) {
    if (!this.state.el) { return; }

    el.disabled = properties.disabled;
    el.hover = properties.hover;
    el.background = properties.background;
    el.color = properties.color;
  }

  registerListeners(el) {
    this.setState({ el });
    el.addEventListener('change', this.updateState);
    el.addEventListener('click', this.props.onClick);

    this.setProperties(el, ButtonState.getInitialState({ disabled: this.props.disabled }));
  }

  updateState(event) {
    this.setState(event.detail);
  }

  render() {
    return (
      <orion-button
        {...this.state}
        ref={this.registerListeners}
        color={this.props.color}
        background={this.props.background}
      >
        {this.props.children}
      </orion-button>
    );
  }
}

const colors = Object.keys(Skins.colors);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  background: PropTypes.oneOf(colors),
  color: PropTypes.oneOf(colors),
  disabled: PropTypes.bool,
};

module.exports = Button;
