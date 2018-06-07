import React from 'react';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getIsLoading, getIsAuthLoading } from '../selectors';

const LoadingFeedback = ({ isLoading }) => (
  isLoading && <LinearProgress style={{ position: 'fixed', top: 0, left: 0, right: 0 }} />
);

const mapStateToProps = state => ({
  isLoading: getIsLoading(state) || getIsAuthLoading(state),
});

const ConnectedLoadingFeedback = connect(mapStateToProps, {})(LoadingFeedback);

export default ConnectedLoadingFeedback;
