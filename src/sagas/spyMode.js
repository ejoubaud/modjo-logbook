import { put, take, select } from 'redux-saga/effects';

import { getUid } from '../sendSummary';
import { getSignedInUserId, getSendSummary } from '../selectors';
import { STOP_SPY_MODE, initSpyMode, exitSpyMode, startSendListSync, stopSendListSync, toggleTab, toggleTableFilterSync } from '../actions';

export default function* start({ payload: { user } }) {
  const { shortId } = user;
  const sendSummary = yield select(getSendSummary);
  const theirUid = getUid(sendSummary, shortId);

  yield put(stopSendListSync());
  yield put(initSpyMode(user));
  yield put(startSendListSync(theirUid));
  yield put(toggleTab(1));
  yield put(toggleTableFilterSync(true));

  yield take(STOP_SPY_MODE);

  yield put(exitSpyMode());
  yield put(stopSendListSync());
  const myUid = yield select(getSignedInUserId);
  yield put(startSendListSync(myUid));
}
