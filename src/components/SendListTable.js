import React from 'react';
import { connect } from 'react-redux';
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
import RefreshIcon from '@material-ui/icons/Refresh';
import formatDistance from 'date-fns/distance_in_words';
import differenceInDays from 'date-fns/difference_in_days';
import format from 'date-fns/format';
import fr from 'date-fns/locale/fr';

import { getPaginatedSendList } from '../selectors';
import { changeSendListPage, toggleColor, toggleSector } from '../actions';
import colors from '../colors';
import ColorButton from './ColorButton';

const formatColor = (colorKey, toggleColor) => {
  if (!colorKey) return null;
  return (
    <ColorButton
      variant="flat"
      size="small"
      color={colorKey}
      onClick={() => toggleColor(colorKey)}
    >
      {colors[colorKey].label}
    </ColorButton>
  );
};

const formatSector = (sectorId, classes, toggleSector) => (
  <IconButton
    variant="fab"
    onClick={() => toggleSector(sectorId)}
    className={classes.sectorButton}
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

const formatType = (type, classes) => (
  type === 'flash' && <Tooltip title="Flash&eacute;"><FlashIcon className={classes.typeIcon} /></Tooltip>
);

const SendListTable = ({
  sends,
  page,
  pageSize,
  totalSize,
  changeSendListPage,
  classes,
  toggleColor,
  toggleSector,
}) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Blocs encha&icirc;n&eacute;s</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        { sends.map(send => (
          <TableRow key={send.id}>
            <TableCell>
              {formatSector(send.sectorId, classes, toggleSector)}
              {formatColor(send.color, toggleColor)}
              {formatType(send.type, classes)}
            </TableCell>
            <TableCell>{formatDate(send.createdAt)}</TableCell>
          </TableRow>
        )) }
      </TableBody>

      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={3}
            count={totalSize}
            rowsPerPage={pageSize}
            page={page - 1}
            onChangePage={(e, page) => changeSendListPage(page + 1)}
            rowsPerPageOptions={[]}
          />
        </TableRow>
      </TableFooter>
    </Table>
  </Paper>
);

const styles = {
  sectorButton: {
    height: '28px',
    width: '28px',
    fontSize: '18px',
  },

  typeIcon: {
    verticalAlign: 'middle',
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
  return {
    sends,
    page,
    pageSize,
    totalSize,
  };
};

const mapDispatchToProps = { changeSendListPage, toggleColor, toggleSector };

const ConnectedSendListTable = connect(mapStateToProps, mapDispatchToProps)(StyledSendListTable);

export default ConnectedSendListTable;
