import { takeEvery, all } from 'redux-saga/effects';

import { SUBMIT_SENDS, SUBMIT_CLEARS } from '../actions';
import submitSends from './submitSends';
import submitClears from './submitClears';

function* rootSaga() {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
    takeEvery(SUBMIT_CLEARS, submitClears),
  ]);
}

export default rootSaga;
