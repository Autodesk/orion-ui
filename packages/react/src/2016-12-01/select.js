
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
require('@orion-ui/components/lib/2016-12-01/select');
const { Skins } = require('@orion-ui/style/lib/2016-12-01');

const React = require('react');
const applyProps = require('@orion-ui/components/lib/utils/apply-props');

const PropTypes = React.PropTypes;

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    applyProps(this._el, this.props);
    this._el.addEventListener('change', this.updateState);
  }

  componentWillReceiveProps(props) {
    applyProps(this._el, props);
  }

  updateState(event) {
    this.componentWillReceiveProps(Object.assign({}, event.detail.state, this.props));
  }

  render() {
    return <orion-select ref={(el) => { this._el = el; }} />;
  }
}

const colors = Object.keys(Skins.colors);

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({  // eslint-disable-line react/no-unused-prop-types
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  open: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  onChange: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  background: PropTypes.oneOf(colors), // eslint-disable-line react/no-unused-prop-types
  color: PropTypes.oneOf(colors), // eslint-disable-line react/no-unused-prop-types
  selectedIndex: PropTypes.number,  // eslint-disable-line react/no-unused-prop-types
};

module.exports = Select;
