import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import SignInButton from './SignInButton';
import ColorSelector from './ColorSelector';
import Plan from './Plan';
import Controls from './Controls';
import SendTables from './SendTables';
import ErrorFeedback from './ErrorFeedback';
import LoadingFeedback from './LoadingFeedback';
import logo from '../images/logo.png';
import colors from '../models/colors';

const App = ({ classes }) => (
  <div className={classes.app}>
    <header className={classes.appHeader}>
      <img src={logo} alt="logo" />
      <SignInButton />
    </header>
    <div className={classes.container}>
      <div className={classes.buttonBar}>
        {Object.keys(colors).map(color => (
          <ColorSelector color={color} key={`button-${color}`} />
        ))}
      </div>
      <Plan />
      <Controls />
      <SendTables />
    </div>
    <ErrorFeedback />
    <LoadingFeedback />
    <footer className={classes.appHeader}>
      Modjo Logbook &ndash; Non-officiel &ndash; <a className={classes.footerLink} target="_blank" rel="noopener noreferrer" href="https://goo.gl/forms/bg950IMOJai8xiPu1">Info et feedback</a>
    </footer>
  </div>
);

const styles = {
  app: {
    textAlign: 'center',
  },

  appHeader: {
    backgroundColor: '#222',
    padding: '20px',
    color: 'white',
  },

  // .container stolen from muicss
  container: {
    boxSizing: 'border-box',
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingLeft: '15px',
    paddingRight: '15px',
    '&:after': {
      clear: 'both',
    },
    '&:before, &:after': {
      content: ' ',
      display: 'table',
    },
    '@media (max-width: 543px)': {
      padding: 0,
    },
    '@media (min-width: 544px)': {
      maxWidth: '570px',
    },
    '@media (min-width: 768px)': {
      maxWidth: '740px',
    },
    '@media (min-width: 992px)': {
      maxWidth: '960px',
    },
    '@media (min-width: 1200px)': {
      maxWidth: '1170px',
    },
  },

  buttonBar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignText: 'center',
  },

  footerLink: {
    color: '#ddd',
    '&:visited': {
      color: '#bbb',
    },
  },
};

const StyledApp = withStyles(styles)(App);

export default StyledApp;
