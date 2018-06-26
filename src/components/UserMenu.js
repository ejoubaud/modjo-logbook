import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField';
import { firebaseConnect } from 'react-redux-firebase';

import { getSignedInUser } from '../selectors';
import { submitDisplayNameUpdate } from '../actions';

const signOut = (logout, toggleDrawer, showError) => () => {
  logout()
    .then(toggleDrawer)
    .catch(err => showError(`Error ${err.code}: ${err.message}`));
};

const UserMenu = (props) => {
  const {
    signedInUser,
    firebase,
    classes,
    displayName,
    displayNameError,
    updateDisplayName,
    showError,
    submitDisplayNameUpdate,
    toggleDrawer,
  } = props;

  return (
    <List
      subheader={<ListSubheader>{signedInUser.displayName}</ListSubheader>}
      className={classes.list}
    >
      <ListItem>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (displayNameError) return;
            submitDisplayNameUpdate(displayName);
            toggleDrawer();
          }}
        >
          <TextField
            error={!!displayNameError}
            label={displayNameError || 'Changer pseudo'}
            value={typeof displayName === 'string' ? displayName : signedInUser.displayName}
            onChange={updateDisplayName}
          />
        </form>
      </ListItem>
      <ListItem button onClick={signOut(firebase.logout, toggleDrawer, showError)}>
        <ListItemText primary="D&eacute;connexion" />
      </ListItem>
    </List>
  );
};

const mapStateToProps = state => ({
  signedInUser: getSignedInUser(state),
});

const mapDispatchToProps = { submitDisplayNameUpdate };

const ConnectedUserMenu = compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
)(UserMenu);

export default ConnectedUserMenu;
