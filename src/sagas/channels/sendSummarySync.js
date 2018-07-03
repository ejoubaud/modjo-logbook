import { put, call, select } from 'redux-saga/effects';

import { initChannelWithFirstLoad } from '../utils';
import { threshold as trimThreshold } from '../submitSendSummaryTrim';
import { firestore } from '../../firebase';
import { getSendSummary, getSignedInUserId } from '../../selectors';
import { STOP_SEND_SUMMARY_SYNC, syncSendSummary, submitSendSummaryTrim } from '../../actions';
import { isEmpty, isEquivalent, hasSameDisplayName, size } from '../../sendSummary';

const hasChangedUserName = (newDoc, oldDoc, uid) => {
  if (!uid || isEmpty(newDoc) || isEmpty(oldDoc)) return false;
  return !hasSameDisplayName(newDoc, oldDoc, uid);
};

function* handleEvent({ doc }) {
  const newDoc = doc.data();
  if (doc.exists) {
    const oldDoc = yield select(getSendSummary);
    const uid = yield select(getSignedInUserId);
    if (!isEquivalent(newDoc, oldDoc) || hasChangedUserName(newDoc, oldDoc, uid)) {
      console.log('sendSummary discrepancy', oldDoc, newDoc);
      yield put(syncSendSummary(newDoc));
    }
  }

  const isSignedIn = yield select(getSignedInUserId);
  if (isSignedIn && size(newDoc) >= trimThreshold) yield put(submitSendSummaryTrim());
}

export default function* start() {
  yield call(initChannelWithFirstLoad, 'sendSummarySync', STOP_SEND_SUMMARY_SYNC, handleEvent, emit => (
    firestore.collection('sendSummary').doc('current').onSnapshot((doc) => {
      emit({ doc });
    })
  ));
}
