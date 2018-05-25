import React from 'react';

import ColorSelector from './ColorSelector';
import Plan from './Plan';
import BoulderForm from './BoulderForm';
import logo from '../logo.png';
import colors from '../colors';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} alt="logo" />
    </header>
    <div className="container">
      <div className="button-bar">
        {Object.keys(colors).map(color => (
          <ColorSelector color={color} key={`button-${color}`} />
        ))}
      </div>
      <Plan />
      <BoulderForm />
    </div>
  </div>
);

export default App;
