import React, { Component } from 'react';
import Button from './ColoredButton';
import Container from 'muicss/lib/react/container';
import Plan from './Plan';
import logo from './logo.svg';
import colors from './colors';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Container>
          { Object.keys(colors).map(color =>
            <Button palette={ colors[color].palette} key={`button-${color}` }>{ colors[color].label }</Button>
          ) }
          <Plan />
        </Container>
      </div>
    );
  }
}

export default App;
