import React from 'react';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';

const LoadingFeedback = ({ isLoading }) => (
  isLoading && <LinearProgress style={{ position: 'fixed', top: 0, left: 0, right: 0 }} />
);

const mapStateToProps = ({ ui, firebase: { auth } }) => ({
  isLoading: ui.isLoading || !auth.isLoaded,
});

const ConnectedLoadingFeedback = connect(mapStateToProps, {})(LoadingFeedback);

export default ConnectedLoadingFeedback;
