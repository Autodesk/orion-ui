import 'tachyons';
import React, { Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import '../vendor/custom-elements-polyfill';
import { Button, Select } from '@orion-ui/react/lib/2016-12-01';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = { selectedIndex: 0 };

    this.setFramework = this.setFramework.bind(this);
  }

  setFramework(event) {
    this.setState({ selectedIndex: event.detail.state.selectedIndex });
  }

  renderInstallInstructions(framework) {
    if (framework === 'react') {
      const installExample = `npm install @orion-ui/react --save-dev`;
      const usageExample = `
import Button from '@orion-ui/react/button';
import ReactDOM from 'react-dom';

ReactDOM.render(<Button>Hello, world!</Button>, document.body);
      `;

      return (
        <div>
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
    <orion-button background="ctrl.button.background" color="ctrl.button.color" ng-click="ctrl.action('clicked')">
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
        <div>
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

  render() {
    const frameworks = [
      { label: 'React', value: 'react', key: 1 },
      { label: 'Angular', value: 'angular', key: 2 },
    ];
    const selectedFramework = frameworks[this.state.selectedIndex].value;

    return (
      <div>
        <div className="sp5">
          <h1 className="f1">Orion</h1>
          <p>A resusable, HIG compliant, UI component library for Autodesk applications based on web standards and open source best pracices.</p>
        </div>
        <div className="sp5">
          <Button>See All Components</Button>
        </div>
        <div>
          <h2 className="f2">Get Started</h2>
          <div>
            <ol>
              <li>
                Install the library for
                <Select options={frameworks} selectedIndex={this.state.selectedIndex} onChange={this.setFramework} />
              </li>
              <li>Import a component</li>
              <li>Ready for production!</li>
            </ol>
            {this.renderInstallInstructions(selectedFramework)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
