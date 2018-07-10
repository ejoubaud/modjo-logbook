import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import UserCell from './cells/UserCell';
import RankingCell from './cells/RankingCell';
import { getPaginatedRanking } from '../selectors';
import { changeRankingPage } from '../actions';

const RankingTip = () => (
  <Fragment>
    Blocs encha&icirc;n&eacute;s sur les 3 derniers mois.<br />
    <br />
    D&eacute;monter un bloc ne modifie pas le palmar&egrave;s:<br />
    le passage pr&eacute;c&eacute;dent compte toujours s&apos;il reste<br />
    dans les 3 mois, mais seul le dernier passage par<br />
    secteur/couleur est comptabilis&eacute;.<br />
    <br />
    La couleur la plus haute l&apos;emporte, puis le nombre de<br />
    blocs par couleur. Pas de bonus pour les flash.<br />
    <br />
    On compte sur votre honn&ecirc;tet&eacute;.
  </Fragment>
);

const RankingTable = (props) => {
  const {
    users,
    page,
    pageSize,
    totalSize,
    changeSendSummaryPage,
  } = props;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">#</TableCell>
            <TableCell padding="dense">Grimpeur</TableCell>
            <TableCell padding="dense" numeric>
              Palmar&egrave;s [
                <Tooltip title={<RankingTip />}>
                  <a
                    href=""
                    onClick={(e) => { e.preventDefault(); }}
                    style={{ textDecoration: 'none' }}
                  >
                    ?
                  </a>
                </Tooltip>
              ]
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          { users.map((userRankingEntry, idx) => (
            <TableRow key={userRankingEntry.uid}>
              <TableCell padding="dense">
                {idx + 1 + ((page - 1) * pageSize)}
              </TableCell>
              <TableCell padding="dense">
                <UserCell user={userRankingEntry} />
              </TableCell>
              <TableCell padding="dense">
                <RankingCell entry={userRankingEntry} />
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
              onChangePage={(e, page) => changeSendSummaryPage(page + 1)}
              rowsPerPageOptions={[]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  const { users, page, pageSize, totalSize } = getPaginatedRanking(state);
  return {
    users,
    page,
    pageSize,
    totalSize,
  };
};

const mapDispatchToProps = { changeRankingPage };

const ConnectedRankingTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RankingTable);

export default ConnectedRankingTable;
