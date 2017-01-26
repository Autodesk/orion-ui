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

const React = require('react');

const PropTypes = React.PropTypes;


const Example = function example(props) {
  const minHeight = props.minHeight || 0;
  return (
    <div className="example" style={{ paddingTop: '30px', paddingBottom: '30px', minHeight: `${minHeight}px` }}>{props.children}</div>
  );
};

Example.propTypes = {
  children: PropTypes.node,
  minHeight: PropTypes.number,
};

module.exports = Example;
