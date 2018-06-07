import { takeEvery, all } from 'redux-saga/effects';

import { SUBMIT_SENDS } from '../actions';
import submitSends from './submitSends';

function* rootSaga() {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
  ]);
}

export default rootSaga;
