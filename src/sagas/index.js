import { takeEvery, all, call } from 'redux-saga/effects';

import { SUBMIT_SENDS, SUBMIT_CLEARS, SUBMIT_SEND_DELETION, SUBMIT_DISPLAY_NAME_UPDATE } from '../actions';
import submitSends from './submitSends';
import submitClears from './submitClears';
import submitSendDeletion from './submitSendDeletion';
import submitDisplayNameUpdate from './submitDisplayNameUpdate';
import handleAuthEventChannel from './channels/authEventChannel';

function* rootSaga(getFirebase) {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
    takeEvery(SUBMIT_CLEARS, submitClears),
    takeEvery(SUBMIT_SEND_DELETION, submitSendDeletion),
    takeEvery(SUBMIT_DISPLAY_NAME_UPDATE, submitDisplayNameUpdate, getFirebase),
    call(handleAuthEventChannel),
  ]);
}

export default rootSaga;
