import React from 'react';
import { connect } from 'react-redux';
import withState from 'recompose/withState';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FlashIcon from '@material-ui/icons/FlashOn';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import formatDistance from 'date-fns/distance_in_words';
import differenceInDays from 'date-fns/difference_in_days';
import format from 'date-fns/format';
import fr from 'date-fns/locale/fr';
import isEmpty from 'lodash/fp/isEmpty';

import { getPaginatedSendList, getSelectedColor, getSelectedSectors } from '../selectors';
import { changeSendListPage, toggleColor, toggleSector, submitSendDeletion } from '../actions';
import colors from '../colors';
import ColorButton from './ColorButton';
import ConfirmDialog from './ConfirmDialog';

const formatColor = (colorKey, { selectedColor, toggleColor }) => {
  if (!colorKey) return null;
  return (
    <ColorButton
      variant={selectedColor ? 'raised' : 'flat'}
      size="small"
      color={colorKey}
      onClick={() => toggleColor(colorKey)}
    >
      {colors[colorKey].label}
    </ColorButton>
  );
};

const formatSector = (sectorId, { selectedSectors, classes, toggleSector }) => (
  <IconButton
    onClick={() => toggleSector(sectorId)}
    className={`${classes.sectorButton} ${!isEmpty(selectedSectors) && classes.sectorButtonSelected}`}
  >
    {sectorId}
  </IconButton>
);

const formatDate = (date) => {
  const now = new Date();
  const formatted = format(date, 'ddd DD/MM HH:mm', { locale: fr });
  if (differenceInDays(date, now) > 2) return <span>formatted</span>;
  return (
    <Tooltip title={formatted}>
      <span>{formatDistance(date, now, { locale: fr })}</span>
    </Tooltip>
  );
};

const formatType = (type, { classes }) => (
  (type === 'flash') && <Tooltip title="Flash&eacute;"><FlashIcon className={classes.typeIcon} /></Tooltip>
);

const formatClear = (type, { classes }) => (
  (type === 'clear') && (
    <Tooltip title="Secteur d&eacute;mont&eacute;">
      <RefreshIcon className={classes.clearIcon} />
    </Tooltip>
  )
);

const SendListTable = (props) => {
  const {
    sends,
    page,
    pageSize,
    totalSize,
    changeSendListPage,
    classes,
    deletionConfirmTarget,
    toggleDeletionConfirmWithTarget,
    submitSendDeletion,
  } = props;

  return (
    <Paper className={classes.container}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">Blocs encha&icirc;n&eacute;s</TableCell>
            <TableCell padding="dense">Date</TableCell>
            <TableCell numeric padding="dense">Supprimer</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          { sends.map(send => (
            <TableRow key={send.id}>
              <TableCell padding="dense">
                {formatColor(send.color, props)}
                {formatClear(send.type, props)}
                {formatSector(send.sectorId, props)}
                {formatType(send.type, props)}
              </TableCell>
              <TableCell padding="dense">{formatDate(send.createdAt)}</TableCell>
              <TableCell numeric padding="dense">
                { send.type !== 'clear' && (
                  <IconButton onClick={() => toggleDeletionConfirmWithTarget(send)}>
                    <DeleteIcon />
                  </IconButton>
                ) }
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
        title="Suppression définitive de l'historique"
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

const styles = {
  container: {
    marginTop: '15px',
    marginBottom: '15px',
  },

  sectorButton: {
    height: '28px',
    width: '28px',
    fontSize: '18px',
  },

  sectorButtonSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  typeIcon: {
    verticalAlign: 'middle',
    marginLeft: '7px',
  },

  clearIcon: {
    verticalAlign: 'middle',
    // to align with the color buttons
    width: '64px',
    marginRight: '4px',
  },
};

const StyledSendListTable = withStyles(styles)(SendListTable);

const mapStateToProps = (state) => {
  const { sends, page, pageSize, totalSize } = getPaginatedSendList(state);
  const selectedColor = getSelectedColor(state);
  const selectedSectors = getSelectedSectors(state);
  return {
    selectedColor,
    selectedSectors,
    sends,
    page,
    pageSize,
    totalSize,
  };
};

const mapDispatchToProps = { changeSendListPage, toggleColor, toggleSector, submitSendDeletion };

const ConnectedSendListTable = connect(mapStateToProps, mapDispatchToProps)(StyledSendListTable);

export default withState('deletionConfirmTarget', 'toggleDeletionConfirmWithTarget', false)(ConnectedSendListTable);
