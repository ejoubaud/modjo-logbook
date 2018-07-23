import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import BoulderForm from './BoulderForm';
import SpyModeButton from './SpyModeButton';
import { getIsSpyModeOn } from '../selectors';

const Controls = ({ isSpyMode, classes }) => (
  <div className={classes.container}>
    { isSpyMode ? <SpyModeButton /> : <BoulderForm /> }
  </div>
);

const styles = {
  container: {
    marginTop: '8px',
  },
};

const StyledControls = withStyles(styles)(Controls);

const mapStateToProps = state => ({
  isSpyMode: getIsSpyModeOn(state),
});

const ConnectedControls = connect(mapStateToProps, {})(StyledControls);

export default ConnectedControls;
