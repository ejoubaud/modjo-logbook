import React from 'react';
import Container from 'muicss/lib/react/container';
import ReactTooltip from 'react-tooltip';

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
    <Container>
      {Object.keys(colors).map(color => (
        <ColorSelector color={color} key={`button-${color}`} />
      ))}
      <Plan />
      <BoulderForm />
      <ReactTooltip event="mouseover click focus" eventOff="mouseout blur" effect="solid" isCapture />
    </Container>
  </div>
);

export default App;
