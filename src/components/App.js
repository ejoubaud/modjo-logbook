import React from 'react';
import Container from 'muicss/lib/react/container';

import ColorSelector from './ColorSelector';
import Plan from './Plan';
import logo from '../logo.svg';
import colors from '../colors';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <Container>
      {Object.keys(colors).map(color => (
        <ColorSelector color={color} key={`button-${color}`} />
      ))}
      <Plan />
    </Container>
  </div>
);

export default App;