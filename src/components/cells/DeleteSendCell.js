import React from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { getSendList, getSendMap } from '../../selectors';
import { wasSectorClearedSince } from '../../sendList';
import { lastSendForSector } from '../../sendMap';
import { isClear } from '../../send';

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

const cantDeleteSend = 'Impossible de supprimer cet enchaînement, le secteur a été marqué comme démonté depuis.';
const cantDeleteClear = 'Impossible de supprimer cette réouverture, un bloc a été enchaîné sur le secteur depuis.';

const DeleteSendCell = ({ send, sendList, sendMap, toggleDeletionConfirmWithTarget }) => {
  if (!canDelete(send, sendMap, sendList)) {
    const cantDeleteReason = (isClear(send) ? cantDeleteClear : cantDeleteSend);
    return (
      <Tooltip title={cantDeleteReason}>
        <div>
          <IconButton onClick={() => toggleDeletionConfirmWithTarget(send)} disabled>
            <DeleteIcon />
          </IconButton>
        </div>
      </Tooltip>
    );
  }
  return (
    <IconButton onClick={() => toggleDeletionConfirmWithTarget(send)}>
      <DeleteIcon />
    </IconButton>
  );
};

const mapStateToProps = state => ({
  sendList: getSendList(state),
  sendMap: getSendMap(state),
});

const mapDispatchToProps = () => ({ });

const ConnectedDeleteSendCell = connect(mapStateToProps, mapDispatchToProps)(DeleteSendCell);

export default ConnectedDeleteSendCell;
