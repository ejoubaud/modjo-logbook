import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import SendSummaryTable from './SendSummaryTable';
import SendListTable from './SendListTable';
import { getSelectedTab, getSignedInUser } from '../selectors';
import { toggleTab } from '../actions';

const SendTables = ({ selectedTab, signedInUser, classes, toggleTab }) => {
  if (!signedInUser) {
    return (
      <div className={classes.container}>
        <SendSummaryTable />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Paper>
        <Tabs
          value={selectedTab}
          onChange={(e, v) => toggleTab(v)}
        >
          <Tab label="Actus">
            <SendSummaryTable />
          </Tab>
          { signedInUser && (
            <Tab label="Mon historique">
              <SendListTable />
            </Tab>
          ) }
        </Tabs>
      </Paper>
      { selectedTab === 0 && <SendSummaryTable /> }
      { selectedTab === 1 && <SendListTable /> }
    </div>
  );
};

const mapStateToProps = state => ({
  selectedTab: getSelectedTab(state),
  signedInUser: getSignedInUser(state),
});

const styles = {
  container: {
    marginTop: '15px',
    marginBottom: '15px',
  },
};

const StyledSendTables = withStyles(styles)(SendTables);

const mapDispatchToProps = { toggleTab };

const ConnectedSendTables = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledSendTables);

export default ConnectedSendTables;
