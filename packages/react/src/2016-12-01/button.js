
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
const applyProps = require('./apply-props');

const PropTypes = React.PropTypes;

function setProperties(el, properties) {
  // Get an intersection of provided and supported properties
  const supportedProps = ['background', 'color', 'size', 'disabled', 'hover'];
  const propsToSet = intersection(supportedProps, Object.keys(properties));

  propsToSet.forEach((name) => {
    el[name] = properties[name];
  });
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.updateState = this.updateState.bind(this);
    this.registerListeners = this.registerListeners.bind(this);
  }

  componentDidMount() {
    applyProps(this._el, this.props);
  }

  componentWillReceiveProps(props) {
    applyProps(this._el, props);
  }

  registerListeners(el) {
    this._el = el;

    /**
     * In general, this will be exposed to the end user and they'll manage it directly by setting an
     * onChange prop. In the case of a button it's silly since the only purpose is to transition
     * between hoverered, focus, and active states.
     */
    this._el.addEventListener('change', this.updateState);
  }

  updateState(event) {
    this.componentWillReceiveProps(event.detail.state);
  }

  render() {
    return <orion-button ref={this.registerListeners}>{this.props.children}</orion-button>;
  }
}

const colors = Object.keys(Skins.colors);
const sizes = ['small', 'large'];

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  background: PropTypes.oneOf(colors), // eslint-disable-line react/no-unused-prop-types
  color: PropTypes.oneOf(colors), // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  size: PropTypes.oneOf(sizes), // eslint-disable-line react/no-unused-prop-types
};

module.exports = Button;
