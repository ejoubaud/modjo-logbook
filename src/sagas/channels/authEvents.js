import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, all, select } from 'redux-saga/effects';

import { generateLoadingId } from '../utils';
import { startSendListSync, stopSendListSync, startSendSummarySync, stopSendSummarySync, syncSendList, syncSendSummary, exitSpyMode, toggleTab, toggleLoading } from '../../actions';
import { auth, firestore } from '../../firebase';
import { getSendSummary, getIsSpyModeOn } from '../../selectors';
import { empty as emptySendList } from '../../sendList';
import { empty as emptySummary, isEmpty } from '../../sendSummary';

const summaryDocRef = firestore.collection('sendSummary').doc('current');

function* resetSendStatesForSignedOutUser() {
  yield put(toggleTab(0));
  yield put(syncSendList(emptySendList));

  const summary = yield select(getSendSummary);
  if (isEmpty(summary)) {
    const loadingId = generateLoadingId('resetSendStatesForSignedOutUser');
    yield put(toggleLoading(true, loadingId));
    const newDoc = yield call([summaryDocRef, 'get']);
    const latestSummary = newDoc.data() || emptySummary;
    yield put(syncSendSummary(latestSummary));
    yield put(toggleLoading(false, loadingId));
  }
}

function* exitIfSpyMode() {
  const isSpying = yield select(getIsSpyModeOn);
  if (isSpying) yield put(exitSpyMode());
}

function* handleEvent(user) {
  if (user) {
    yield all([
      put(startSendListSync(user.uid)),
      put(startSendSummarySync()),
    ]);
  } else {
    yield all([
      put(stopSendListSync()),
      put(stopSendSummarySync()),
    ]);
    yield call(exitIfSpyMode);
    yield call(resetSendStatesForSignedOutUser);
  }
}

export default function* start() {
  const channel = eventChannel(emit => (
    auth.onAuthStateChanged((user) => {
      if (user) {
        emit(user);
      } else {
        emit(false);
      }
    })
  ));

  yield takeEvery(channel, handleEvent);
}
