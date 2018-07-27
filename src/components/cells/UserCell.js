import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';

import Avatar from '../Avatar';
import { sharedTooltipTouchConfig } from '../shared';
import { getSpyModeTarget, getSignedInUser } from '../../selectors';
import { startSpyMode, stopSpyMode } from '../../actions';
import { mockUser } from '../../models/user';

const UserCell = (props) => {
  const { user, rank, classes, signedInUser, spyModeTarget, startSpyMode, stopSpyMode } = props;
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
      { rank && <Hidden smUp><span className={classes.ranking}>{rank}.</span></Hidden> }
      <Avatar user={user} />
      <span className={classes.name}>{user.displayName}</span>
    </Button>
  );

  if (isDisabled) return button;
  const tip = shouldTurnSpyModeOff ? 'Cliquer pour revenir à votre logbook' : 'Cliquer pour voir son logbook';

  return <Tooltip title={tip} {...sharedTooltipTouchConfig}>{button}</Tooltip>;
};

const styles = {
  ranking: {
    display: 'inline-block',
    marginRight: '10px',
  },
  name: {
    textAlign: 'left',
  },
};

const StyledUserCell = withStyles(styles)(UserCell);

const mapStateToProps = state => ({
  spyModeTarget: getSpyModeTarget(state),
  signedInUser: getSignedInUser(state) || mockUser,
});

const mapDispatchToProps = { startSpyMode, stopSpyMode };

const ConnectedUserCell = connect(mapStateToProps, mapDispatchToProps)(StyledUserCell);

export default ConnectedUserCell;
