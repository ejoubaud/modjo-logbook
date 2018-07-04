import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import Snackbar from '@material-ui/core/Snackbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import withStateHandlers from 'recompose/withStateHandlers';

import Avatar from './Avatar';
import UserMenu from './UserMenu';
import { getSignedInUser, getIsAuthLoading } from '../selectors';
import googleLogo from '../images/google.svg';
import facebookLogo from '../images/facebook.svg';

const signIn = (login, provider, toggleDrawer, showError) => () => {
  login({ provider })
    .then(toggleDrawer)
    .catch(err => showError(`Error ${err.code}: ${err.message}`));
};

const SignInButton = (props) => {
  const {
    signedInUser,
    isLoading,
    isOpenDrawer,
    displayName,
    displayNameError,
    errorMsg,
    firebase,
    classes,
    toggleDrawer,
    showError,
    updateDisplayName,
  } = props;

  return (
    <Fragment>
      <Button className={classes.signIn} variant="outlined" onClick={toggleDrawer}>
        { isLoading
          ? (
            <Fragment>
              <CircularProgress className={classes.avatar} size={15} />
              <Hidden xsDown>
                <span>Chargement...</span>
              </Hidden>
            </Fragment>
          )
          : (signedInUser
            ? (
              <Fragment>
                <Avatar user={signedInUser} />
                <Hidden xsDown>
                  <span>{signedInUser.displayName}</span>
                </Hidden>
              </Fragment>
            )
            : 'Connexion'
          )
        }
      </Button>

      <Drawer anchor="right" open={isOpenDrawer} onClose={toggleDrawer}>
        { signedInUser
          ? (
            <UserMenu
              {...{ classes, displayName, displayNameError, updateDisplayName, toggleDrawer }}
            />
          ) : (
            <List
              subheader={<ListSubheader>Se connecter avec</ListSubheader>}
              className={classes.list}
            >
              <ListItem button onClick={signIn(firebase.login, 'google', toggleDrawer, showError)}>
                <ListItemIcon><img src={googleLogo} alt="google logo" height="24" /></ListItemIcon>
                <ListItemText primary="Google" />
              </ListItem>
              <ListItem button onClick={signIn(firebase.login, 'facebook', toggleDrawer, showError)}>
                <ListItemIcon><img src={facebookLogo} alt="facebook logo" height="24" /></ListItemIcon>
                <ListItemText primary="Facebook" />
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
    minWidth: 0,
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
    '&+span': {
      marginLeft: '10px',
    },
  },
};

const StyledSignInButton = withStyles(styles)(SignInButton);

const validateDisplayName = (name) => {
  if (name.match(/[^a-zA-Z0-9\-' ]/)) return 'Pas de carac spéciaux';
  if (name.length < 3) return 'Trop court (4 min)';
  if (name.length > 20) return 'Trop long (20 max)';
  if (name.match(/^ /)) return 'Espace en début';
  if (name.match(/ $/)) return 'Espace en fin';
  if (name.match(/ {2}/)) return 'Double espace';
  return null;
};

const StatefulSignInButton = withStateHandlers(
  ({ signedInUser }) => ({
    isOpenDrawer: false,
    displayName: signedInUser && signedInUser.displayName,
    displayNameError: null,
  }),
  {
    toggleDrawer: ({ isOpenDrawer, displayName, displayNameError }) => () => ({
      isOpenDrawer: !isOpenDrawer,
      // reset field on drawer close
      displayName: isOpenDrawer ? displayName : null,
      displayNameError: isOpenDrawer ? displayNameError : null,
    }),
    showError: () => msg => ({ errorMsg: msg }),
    updateDisplayName: () => (e) => {
      const displayName = e.target.value;
      return { displayName, displayNameError: validateDisplayName(displayName) };
    },
  },
)(StyledSignInButton);

const mapStateToProps = state => ({
  signedInUser: getSignedInUser(state),
  isLoading: getIsAuthLoading(state),
});

const ConnectedSignInButton = compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(StatefulSignInButton);

export default ConnectedSignInButton;
