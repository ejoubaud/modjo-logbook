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
import Hidden from '@material-ui/core/Hidden';

import SendHeaderCell from './cells/SendHeaderCell';
import UserCell from './cells/UserCell';
import SendCell from './cells/SendCell';
import DateCell from './cells/DateCell';
import { getPaginatedSendSummary } from '../selectors';
import { changeSendSummaryPage } from '../actions';

const SendSummaryTable = (props) => {
  const {
    sends,
    page,
    pageSize,
    totalSize,
    classes,
    changeSendSummaryPage,
  } = props;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">Grimpeur</TableCell>
            <TableCell padding="dense" className={classes.centerOnSmall}>
              <SendHeaderCell />
            </TableCell>
            <Hidden xsDown>
              <TableCell padding="dense">Date</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>

        <TableBody>
          { sends.map(send => (
            <TableRow key={send.id}>
              <TableCell padding="none">
                <UserCell user={send.user} />
              </TableCell>
              <TableCell padding="dense" className={classes.centerOnSmall}>
                <SendCell send={send} />
              </TableCell>
              <Hidden xsDown>
                <TableCell padding="dense">
                  <DateCell date={send.createdAt} />
                </TableCell>
              </Hidden>
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
              onChangePage={(e, page) => changeSendSummaryPage(page + 1)}
              rowsPerPageOptions={[]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
};

const styles = {
  '@media (max-width: 600px)': {
    centerOnSmall: {
      textAlign: 'center',
    },
  },
};

const StyledSendSummaryTable = withStyles(styles)(SendSummaryTable);

const mapStateToProps = (state) => {
  const { sends, page, pageSize, totalSize } = getPaginatedSendSummary(state);
  return {
    sends,
    page,
    pageSize,
    totalSize,
  };
};

const mapDispatchToProps = { changeSendSummaryPage };

const ConnectedSendSummaryTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledSendSummaryTable);

export default ConnectedSendSummaryTable;
