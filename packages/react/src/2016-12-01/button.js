
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

const PropTypes = React.PropTypes;

function Button(props) {
  return (
    <orion-button onClick={props.onClick} color={props.color} background={props.background}>
      {props.children}
    </orion-button>);
}

const colors = Object.keys(Skins.colors);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  background: PropTypes.oneOf(colors),
  color: PropTypes.oneOf(colors),
};

module.exports = Button;
