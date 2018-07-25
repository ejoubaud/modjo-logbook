import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import SendSummaryTable from './SendSummaryTable';
import SendListTable from './SendListTable';
import RankingTable from './RankingTable';
import Avatar from './Avatar';
import { getSelectedTab, getSendList, getSpyModeTarget } from '../selectors';
import { toggleTab } from '../actions';
import { isEmpty } from '../collections/sendList';

const SendListLabel = ({ spyModeTarget, classes }) => (
  spyModeTarget
    ? (
      <Fragment>
        <span className={classes.tab}>
          <Avatar user={spyModeTarget} />
          <span>Son logbook</span>
        </span>
      </Fragment>
    ) : (
      <span>Mon logbook</span>
    )
);

const SendTables = ({ selectedTab, hasSendList, spyModeTarget, classes, toggleTab }) => (
  <div className={classes.container}>
    <Paper>
      <Tabs
        value={selectedTab}
        onChange={(e, v) => toggleTab(v)}
        centered
      >
        <Tab label="Actus" value={0} />
        { hasSendList && (
          <Tab
            label={<SendListLabel spyModeTarget={spyModeTarget} classes={classes} />}
            value={1}
          />
        ) }
        <Tab label="Classement" value={2} />
      </Tabs>
    </Paper>
    { selectedTab === 0 && <SendSummaryTable /> }
    { selectedTab === 1 && <SendListTable /> }
    { selectedTab === 2 && <RankingTable /> }
  </div>
);

const mapStateToProps = state => ({
  selectedTab: getSelectedTab(state),
  hasSendList: !isEmpty(getSendList(state)),
  spyModeTarget: getSpyModeTarget(state),
});

const styles = {
  container: {
    marginTop: '12px',
  },
  tab: {
    display: 'flex',
    '& img': {
      marginTop: '-3px',
    },
  },
};

const StyledSendTables = withStyles(styles)(SendTables);

const mapDispatchToProps = { toggleTab };

const ConnectedSendTables = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledSendTables);

export default ConnectedSendTables;
