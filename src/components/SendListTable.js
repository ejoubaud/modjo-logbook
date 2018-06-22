import React from 'react';
import { connect } from 'react-redux';
import withState from 'recompose/withState';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import SendHeaderCell from './cells/SendHeaderCell';
import SendCell from './cells/SendCell';
import DateCell from './cells/DateCell';
import DeleteSendCell from './cells/DeleteSendCell';
import ConfirmDialog from './ConfirmDialog';
import { getPaginatedSendList } from '../selectors';
import { changeSendListPage, submitSendDeletion } from '../actions';

const SendListTable = (props) => {
  const {
    sends,
    page,
    pageSize,
    totalSize,
    changeSendListPage,
    deletionConfirmTarget,
    toggleDeletionConfirmWithTarget,
    submitSendDeletion,
  } = props;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">
              <SendHeaderCell />
            </TableCell>
            <TableCell padding="dense">Date</TableCell>
            <TableCell numeric padding="dense">Supprimer</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          { sends.map(send => (
            <TableRow key={send.id}>
              <TableCell padding="dense">
                <SendCell send={send} />
              </TableCell>
              <TableCell padding="dense">
                <DateCell date={send.createdAt} />
              </TableCell>
              <TableCell numeric padding="dense">
                <DeleteSendCell
                  send={send}
                  toggleDeletionConfirmWithTarget={toggleDeletionConfirmWithTarget}
                />
              </TableCell>
            </TableRow>
          )) }
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={2}
              count={totalSize}
              rowsPerPage={pageSize}
              page={page - 1}
              onChangePage={(e, page) => changeSendListPage(page + 1)}
              rowsPerPageOptions={[]}
            />
          </TableRow>
        </TableFooter>
      </Table>

      <ConfirmDialog
        title="Suppression définitive du logbook"
        isOpen={!!deletionConfirmTarget}
        toggleConfirm={() => toggleDeletionConfirmWithTarget(null)}
        onConfirm={() => submitSendDeletion(deletionConfirmTarget)}
      >
        La suppression du passage est d&eacute;finitive et le supprimera de l&apos;historique.
        Elle n&apos;est recommand&eacute;e qu&apos;en cas d&apos;erreur de saisie.<br />
        Pour enregistrer l&apos;encha&icirc;nement d&apos;un nouveau bloc sur un secteur qui a
        &eacute;t&eacute; r&eacute;ouvert depuis le passage pr&eacute;c&eacute;dent
        tout en conservant celui-ci dans l&apos;historique,
        privil&eacute;gier le bouton <strong>D&eacute;mont&eacute;</strong>.<br />
        Continuer&nbsp;?
      </ConfirmDialog>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  const { sends, page, pageSize, totalSize } = getPaginatedSendList(state);
  return {
    sends,
    page,
    pageSize,
    totalSize,
  };
};

const mapDispatchToProps = { changeSendListPage, submitSendDeletion };

const ConnectedSendListTable = connect(mapStateToProps, mapDispatchToProps)(SendListTable);

export default withState('deletionConfirmTarget', 'toggleDeletionConfirmWithTarget', false)(ConnectedSendListTable);
