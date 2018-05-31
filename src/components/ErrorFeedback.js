import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import toPairs from 'lodash/fp/toPairs';

import { hideError } from '../actions';

const ErrorFeedback = ({ errorMsg, isErrorHidden, hideError, ignoreId }) => (
  <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    open={!isErrorHidden && !!errorMsg}
    autoHideDuration={6000}
    onClose={hideError}
    ContentProps={{ 'aria-describedby': 'message-id' }}
    message={<span id="message-id">{errorMsg}</span>}
    action={[
      (ignoreId
        ? (
          <Button
            onClick={() => hideError(ignoreId)}
            color="secondary"
            key="ignore"
          >
            Ne plus montrer
          </Button>
        ) : null
      ),
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={hideError}
      >
        <CloseIcon />
      </IconButton>,
    ]}
  />
);

const errorToMsg = (error) => {
  if (Array.isArray(error)) return error.map(errorToMsg).join(',');
  if (typeof error === 'string') return error;
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  if (typeof error === 'object') return toPairs(error).map(([k, v]) => `${k}: ${errorToMsg(v)}`).join(' ; ');
  if (!error) return null;
  return error.toString();
};

const mapStateToProps = ({ ui: { error, errorIgnoreId, isErrorHidden } }) => ({
  errorMsg: errorToMsg(error),
  ignoreId: errorIgnoreId,
  isErrorHidden,
});

const mapDispatchToProps = { hideError };

const ConnectedErrorFeedback = connect(mapStateToProps, mapDispatchToProps)(ErrorFeedback);

export default ConnectedErrorFeedback;
