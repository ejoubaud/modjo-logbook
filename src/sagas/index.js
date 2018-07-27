import { takeEvery, takeLatest, all, call } from 'redux-saga/effects';

import { SUBMIT_SENDS, SUBMIT_CLEARS, SUBMIT_SEND_DELETION, SUBMIT_DISPLAY_NAME_UPDATE, SUBMIT_SEND_SUMMARY_USER_UPDATE, SUBMIT_SEND_LIST_TRIM, SUBMIT_SEND_SUMMARY_TRIM, DOWNLOAD_SEND_LIST_AS_CSV, START_SEND_LIST_SYNC, START_SEND_SUMMARY_SYNC, START_SPY_MODE } from '../actions';
import submitSends from './submitSends';
import submitClears from './submitClears';
import submitSendDeletion from './submitSendDeletion';
import submitDisplayNameUpdate from './submitDisplayNameUpdate';
import submitSendSummaryUserUpdate from './submitSendSummaryUserUpdate';
import submitSendListTrim from './submitSendListTrim';
import submitSendSummaryTrim from './submitSendSummaryTrim';
import downloadSendListAsCsv from './downloadSendListAsCsv';
import startListeningToAuthEvents from './channels/authEvents';
import startListeningToAuthRedirectEvents from './channels/authRedirectEvents';
import startSendListSync from './channels/sendListSync';
import startSendSummarySync from './channels/sendSummarySync';
import startSpyMode from './spyMode';

function* rootSaga() {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
    takeEvery(SUBMIT_CLEARS, submitClears),
    takeEvery(SUBMIT_SEND_DELETION, submitSendDeletion),
    takeEvery(SUBMIT_DISPLAY_NAME_UPDATE, submitDisplayNameUpdate),
    takeEvery(SUBMIT_SEND_SUMMARY_USER_UPDATE, submitSendSummaryUserUpdate),
    takeEvery(SUBMIT_SEND_LIST_TRIM, submitSendListTrim),
    takeEvery(SUBMIT_SEND_SUMMARY_TRIM, submitSendSummaryTrim),
    takeLatest(DOWNLOAD_SEND_LIST_AS_CSV, downloadSendListAsCsv),
    takeEvery(START_SEND_LIST_SYNC, startSendListSync),
    takeEvery(START_SEND_SUMMARY_SYNC, startSendSummarySync),
    takeLatest(START_SPY_MODE, startSpyMode),
    call(startListeningToAuthEvents),
    call(startListeningToAuthRedirectEvents),
  ]);
}

export default rootSaga;
