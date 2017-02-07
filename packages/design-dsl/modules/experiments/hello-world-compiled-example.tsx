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
// HelloWorld.orn source
const HelloWorldOrn = `
  <orion>
    <component => name>
      <text size=3>Hello {name}</text>
    </component>
  </orion>
`

/**
 * orion-compile HelloWorld.orn produces HelloWorld.js:
 */

const HelloWorldJs = `
  function render(root, component) {
    const text = document.createElement('orion-text');
    text.size = 3;

    text.appendChild(
      document.createTextNode('Hello ')
    );

    const text2 = document.createTextNode(root.name);
    text.appendChild(text2);

    return {
      mount: function (target) {
        target.appendChild(text);
      },

      update: function (changed, root) {
        text2.data = root.name;
      },

      teardown: function() {
        text.parentNode.removeChild(text);
      }
    }
  }

  export default class HelloWorld {
    constructor(mount, props) {
      this._props = props;
      this._handlers = Object.create(null);
      this._fragment = render( this._props, this );
      this._fragment.mount(mount);
    }

    get(key) {
      return key ? this._props[key] : this._props;
    }

    set(newProps) {
      const oldProps = this._props;
      this._props = Object.assign({}, oldProps, newProps);
      this._fragment.update( newProps, this._props)
    }

    teardown() {
      this._fragment.teardown();
      this._fragment = null;
      this._props = {};
    }
  }
`

// Which can be used in React like so:
const HelloWorldReact = `
  import React from 'react';
  import HelloWorld from './HelloWorld';

  export default class HelloWorldReact extends React.Component {
    componentDidMount() {
      this._component = new HelloWorld(this._el, this.props);
    }

    componentWillReceiveProps(props) {
      this._component.set(props);
    }

    mount(el) {
      this._el = el;
    }

    render() {
      return <div ref={this.mount}></div>
    }
  }
`

// Which can then be used like
const AppSrc = `
  import HelloWorldReact from './HelloWorldReact';
  import React from 'react';
  import ReactDOM from 'react-dom';

  class App extends React.Component {
    render() {
      return <HelloWorldReact name="World" />
    }
  }

  ReactDOM.render(<App />, document.body);
`