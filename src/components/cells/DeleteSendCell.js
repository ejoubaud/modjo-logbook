import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { sharedTooltipTouchConfig } from '../shared';
import { getSendList, getSendMap } from '../../selectors';
import { wasSectorClearedSince } from '../../collections/sendList';
import { lastSendForSector } from '../../collections/sendMap';
import { isClear } from '../../models/send';

const canDelete = (send, sendMap, sendList) => {
  const lastSectorSend = lastSendForSector(sendMap, send.sectorId);
  // if it's a clear being deleted, easy: it must be the last event on its sector
  if (isClear(send)) return lastSectorSend.id === send.id;
  // if it's a send (not a clear), it can be deleted unless a clear happened since
  if (isClear(lastSectorSend)) return false;
  if (lastSectorSend.id === send.id) return true;
  // then we can't tell from the (fast) sendMap, we have to iterate over the sendList
  return !wasSectorClearedSince(sendList, send);
};

const CantDeleteReason = ({ send }) => (
  <div style={{ textAlign: 'center' }}>
    Suppression impossible <br />
    { isClear(send)
        ? `un bloc a été validé sur le secteur ${send.sectorId} depuis`
        : `le secteur ${send.sectorId} a été démonté depuis`
    }
  </div>
);

const DeleteSendCell = ({ send, sendList, sendMap, classes, toggleDeletionConfirmWithTarget }) => {
  if (!canDelete(send, sendMap, sendList)) {
    return (
      <Tooltip
        title={<CantDeleteReason send={send} />}
        placement="left"
        {...sharedTooltipTouchConfig}
      >
        <IconButton
          className={classes.disabled}
          disableRipple
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <IconButton onClick={() => toggleDeletionConfirmWithTarget(send)}>
      <DeleteIcon />
    </IconButton>
  );
};

const styles = {
  // use a disabled style rather than disable button so as to show the tooltip
  disabled: {
    opacity: '0.5',
    cursor: 'default',
    '&:hover,&:active': {
      backgroundColor: 'initial',
      boxShadow: 'none',
    },
  },
};

const mapStateToProps = state => ({
  sendList: getSendList(state),
  sendMap: getSendMap(state),
});

const mapDispatchToProps = () => ({ });

const StyledDeleteSendCell = withStyles(styles)(DeleteSendCell);

const ConnectedDeleteSendCell = connect(mapStateToProps, mapDispatchToProps)(StyledDeleteSendCell);

export default ConnectedDeleteSendCell;
