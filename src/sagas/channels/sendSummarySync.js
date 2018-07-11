import { put, call, select } from 'redux-saga/effects';

import { initChannelWithFirstLoad } from '../utils';
import { threshold as trimThreshold } from '../submitSendSummaryTrim';
import { firestore } from '../../firebase';
import { getSendSummary, getSignedInUser } from '../../selectors';
import { STOP_SEND_SUMMARY_SYNC, syncSendSummary, submitSendSummaryTrim, submitSendSummaryUserUpdate } from '../../actions';
import { isEmpty, isEquivalent, hasChangedProfile, size, getUserByUid } from '../../sendSummary';

const wasProfileUpdated = (newDoc, oldDoc, uid) => {
  if (!uid || isEmpty(newDoc) || isEmpty(oldDoc)) return false;
  const oldProfile = getUserByUid(oldDoc, uid);
  return hasChangedProfile(newDoc, oldProfile);
};

const shouldUpdateProfile = (summary, user) => {
  if (!user.uid || isEmpty(summary)) return false;
  return hasChangedProfile(summary, user);
};

function* handleEvent({ doc }) {
  const newDoc = doc.data();
  if (doc.exists) {
    const oldDoc = yield select(getSendSummary);
    const signedInUser = yield select(getSignedInUser);

    if (!isEquivalent(newDoc, oldDoc) || wasProfileUpdated(newDoc, oldDoc, signedInUser.uid)) {
      console.log('sendSummary discrepancy', oldDoc, newDoc);
      yield put(syncSendSummary(newDoc));
    }

    if (signedInUser) {
      if (size(newDoc) >= trimThreshold) yield put(submitSendSummaryTrim());
      if (shouldUpdateProfile(newDoc, signedInUser)) yield put(submitSendSummaryUserUpdate());
    }
  }
}

export default function* start() {
  yield call(initChannelWithFirstLoad, 'sendSummarySync', STOP_SEND_SUMMARY_SYNC, handleEvent, emit => (
    firestore.collection('sendSummary').doc('current').onSnapshot((doc) => {
      emit({ doc });
    })
  ));
}
