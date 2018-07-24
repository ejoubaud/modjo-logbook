import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CancelIcon from '@material-ui/icons/Cancel';
import Paper from '@material-ui/core/Paper';

import Avatar from './Avatar';
import { sharedTooltipTouchConfig } from './shared';
import { getSpyModeTarget } from '../selectors';
import { stopSpyMode } from '../actions';

const SpyModeButton = ({ spyModeTarget, stopSpyMode, classes }) => (
  <Paper className={classes.container}>
    <Tooltip title="Quitter son logbook" {...sharedTooltipTouchConfig}>
      <Button variant="outlined" onClick={stopSpyMode} fullWidth>
        <Avatar user={spyModeTarget} /><span>{spyModeTarget.displayName}</span>
        <CancelIcon className={classes.rightIcon} />
      </Button>
    </Tooltip>
  </Paper>
);

const styles = {
  container: {
    padding: '10px',
  },
  leftLabel: {
    marginRight: '12px',
  },
  rightIcon: {
    marginLeft: '8px',
  },
};

const StyledSpyModeButton = withStyles(styles)(SpyModeButton);

const mapStateToProps = state => ({
  spyModeTarget: getSpyModeTarget(state),
});

const mapDispatchToProps = { stopSpyMode };

const ConnectedSpyModeButton = connect(mapStateToProps, mapDispatchToProps)(StyledSpyModeButton);

export default ConnectedSpyModeButton;
