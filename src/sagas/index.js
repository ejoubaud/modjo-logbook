import { takeEvery, all, call } from 'redux-saga/effects';

import { SUBMIT_SENDS, SUBMIT_CLEARS, SUBMIT_SEND_DELETION, SUBMIT_DISPLAY_NAME_UPDATE, START_SEND_LIST_SYNC, START_SEND_SUMMARY_SYNC } from '../actions';
import submitSends from './submitSends';
import submitClears from './submitClears';
import submitSendDeletion from './submitSendDeletion';
import submitDisplayNameUpdate from './submitDisplayNameUpdate';
import startListeningToAuthEvents from './channels/authEvents';
import startSendListSync from './channels/sendListSync';
import startSendSummarySync from './channels/sendSummarySync';

function* rootSaga(getFirebase) {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
    takeEvery(SUBMIT_CLEARS, submitClears),
    takeEvery(SUBMIT_SEND_DELETION, submitSendDeletion),
    takeEvery(SUBMIT_DISPLAY_NAME_UPDATE, submitDisplayNameUpdate, getFirebase),
    takeEvery(START_SEND_LIST_SYNC, startSendListSync),
    takeEvery(START_SEND_SUMMARY_SYNC, startSendSummarySync),
    call(startListeningToAuthEvents),
  ]);
}

export default rootSaga;
