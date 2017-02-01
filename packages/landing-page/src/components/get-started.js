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
<div ng-controller="DemoController as ctrl">
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
.controller('DemoController', function() {
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
