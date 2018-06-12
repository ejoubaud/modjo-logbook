import { takeEvery, all, call } from 'redux-saga/effects';

import { SUBMIT_SENDS, SUBMIT_CLEARS, SUBMIT_SEND_DELETION } from '../actions';
import submitSends from './submitSends';
import submitClears from './submitClears';
import submitSendDeletion from './submitSendDeletion';
import handleAuthEventChannel from './channels/authEventChannel';

function* rootSaga() {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
    takeEvery(SUBMIT_CLEARS, submitClears),
    takeEvery(SUBMIT_SEND_DELETION, submitSendDeletion),
    call(handleAuthEventChannel),
  ]);
}

export default rootSaga;
