import '@orion-ui/components/lib/2016-12-01';
import React from 'react';
import logo from './logo.svg';
import './App.css';

const App = function App() {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
        <orion-button>Hello from React!</orion-button>
        <orion-inline background="black" color="white">Hello orion-inline</orion-inline>
      </p>
    </div>
  );
};

export default App;
