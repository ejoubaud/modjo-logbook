import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import withStateHandlers from 'recompose/withStateHandlers';

import googleLogo from '../images/google.svg';

const signIn = (login, toggleDrawer, showError) => () => {
  login({ provider: 'google' })
    .then(toggleDrawer)
    .catch(err => console.log('firebase login error', err) || showError(`Error ${err.code}: ${err.message}`));
};

const signOut = (logout, toggleDrawer, showError) => () => {
  logout()
    .then(toggleDrawer)
    .catch(err => console.log('firebase login error', err) || showError(`Error ${err.code}: ${err.message}`));
};


const SignInButton = (props) => {
  const {
    signedInUser,
    isLoading,
    isOpenDrawer,
    errorMsg,
    firebase,
    classes,
    toggleDrawer,
    showError,
  } = props;
  return (
    <Fragment>
      <Button className={classes.signIn} variant="outlined" onClick={toggleDrawer}>
        { isLoading
          ? (
            <Fragment>
              <CircularProgress className={classes.avatar} size={15} />
              Chargement...
            </Fragment>
          )
          : (signedInUser
            ? (
              <Fragment>
                <img alt="avatar" src={signedInUser.photoURL} className={classes.avatar} />
                {signedInUser.displayName}
              </Fragment>
            )
            : 'Connexion'
          )
        }
      </Button>

      <Drawer anchor="right" open={isOpenDrawer} onClose={toggleDrawer}>
        { signedInUser
          ? (
            <List
              subheader={<ListSubheader>{signedInUser.displayName}</ListSubheader>}
              className={classes.list}
            >
              <ListItem button onClick={signOut(firebase.logout, toggleDrawer, showError)}>
                <ListItemText primary="D&eacute;connexion" />
              </ListItem>
            </List>
          ) : (
            <List
              subheader={<ListSubheader>Se connecter avec</ListSubheader>}
              className={classes.list}
            >
              <ListItem button onClick={signIn(firebase.login, toggleDrawer, showError)}>
                <ListItemIcon><img src={googleLogo} alt="google logo" height="24" /></ListItemIcon>
                <ListItemText primary="Google" />
              </ListItem>
            </List>
          )}
      </Drawer>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={() => showError(null)}
        ContentProps={{ 'aria-describedby': 'message-id' }}
        message={<span id="message-id">{errorMsg}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => showError(null)}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Fragment>
  );
};

const styles = {
  signIn: {
    position: 'absolute',
    right: '20px',
    top: '20px',
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.23)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  list: {
    width: '250px',
  },
  avatar: {
    width: '20px',
    marginRight: '10px',
  },
};

const StyledSignInButton = withStyles(styles)(SignInButton);

const StatefulSignInButton = withStateHandlers({ isOpenDrawer: false }, {
  toggleDrawer: ({ isOpenDrawer }) => () => ({ isOpenDrawer: !isOpenDrawer }),
  showError: () => msg => ({ errorMsg: msg }),
})(StyledSignInButton);

const mapStateToProps = ({ firebase: { auth } }) => ({
  signedInUser: !auth.isEmpty && auth,
  isLoading: !auth.isLoaded,
});

const ConnectedSignInButton = compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(StatefulSignInButton);

export default ConnectedSignInButton;
