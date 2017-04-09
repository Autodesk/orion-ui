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
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';

function GetStarted(props) {
  if (props.framework === 'react') {
    const installExample = `npm install @orion-ui/react --save-dev`;
    const usageExample = `
import Button from '@orion-ui/react/button';
import ReactDOM from 'react-dom';

ReactDOM.render(<Button>Hello, world!</Button>, document.body);
    `;

    return (
      <div className={props.className}>
        <SyntaxHighlighter
          language="bash"
          style={docco}
        >{installExample}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          language="javascript"
          style={docco}
        >{usageExample}
        </SyntaxHighlighter>
      </div>
    );
  } else {
    const installExample = `npm install @orion-ui/angular --save-dev`;
    const usageHTML = `
<!doctype html>
<html>
<body ng-app="app">
<div ng-controller="AppController as ctrl">
  <orion-button
    background="ctrl.button.background"
    color="ctrl.button.color"
    ng-click="ctrl.action('clicked')"
  >
    {{ctrl.button.label}}
  </orion-button>
</div>
</body>
</html>
    `;
    const usageJS = `
import 'angular';
import '@orion-ui/angular/lib/2016-12-01';

angular
.module('app', ['orion']) // include orion module
.controller('AppController', function() {
  var ctrl = this;

  ctrl.button = {
    label: 'Hello, world!',
    color: 'white',
    background: 'black'
  };

  ctrl.action = function(arg) {
    alert(arg);
  }
});
    `;

    return (
      <div className={props.className}>
        <SyntaxHighlighter
          language="bash"
          style={docco}
        >{installExample}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          language="html"
          style={docco}
        >{usageHTML}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          language="javascript"
          style={docco}
        >{usageJS}
        </SyntaxHighlighter>
      </div>
    );
  }
}

module.exports = GetStarted;
