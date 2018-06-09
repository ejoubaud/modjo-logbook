import { takeEvery, all, call } from 'redux-saga/effects';

import { SUBMIT_SENDS, SUBMIT_CLEARS } from '../actions';
import submitSends from './submitSends';
import submitClears from './submitClears';
import handleAuthEventChannel from './channels/authEventChannel';

function* rootSaga() {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
    takeEvery(SUBMIT_CLEARS, submitClears),
    call(handleAuthEventChannel),
  ]);
}

export default rootSaga;
