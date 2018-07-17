import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import Avatar from '../Avatar';
import { getSpyModeTarget, getSignedInUser } from '../../selectors';
import { startSpyMode, stopSpyMode } from '../../actions';
import mockUser from '../../models/mockUser';

const UserCell = (
  { user, signedInUser, spyModeTarget, startSpyMode, stopSpyMode },
) => {
  const isSignedInUser = signedInUser.uid === user.uid;
  const isSpyModeOn = !!spyModeTarget;
  const isSpyModeTarget = isSpyModeOn && user.uid === spyModeTarget.uid;
  const isDisabled = isSpyModeTarget || (!isSpyModeOn && isSignedInUser);
  const shouldTurnSpyModeOff = isSpyModeOn && isSignedInUser;
  const button = (
    <Button
      disabled={isDisabled}
      onClick={() => (shouldTurnSpyModeOff ? stopSpyMode() : startSpyMode(user))}
    >
      <Avatar user={user} />
      <span>{user.displayName}</span>
    </Button>
  );
  if (isDisabled) return button;
  const tip = shouldTurnSpyModeOff ? 'Cliquer pour revenir à votre logbook' : 'Cliquer pour voir son logbook';
  return <Tooltip title={tip}>{button}</Tooltip>;
};

const mapStateToProps = state => ({
  spyModeTarget: getSpyModeTarget(state),
  signedInUser: getSignedInUser(state) || mockUser,
});

const mapDispatchToProps = { startSpyMode, stopSpyMode };

const ConnectedUserCell = connect(mapStateToProps, mapDispatchToProps)(UserCell);

export default ConnectedUserCell;
