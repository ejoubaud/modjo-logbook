import { eventChannel } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { firestore } from '../../firebase';
import { getSendSummary, getSignedInUserId } from '../../selectors';
import { syncSendSummary, toggleTab } from '../../actions';
import { empty, isEmpty, isEquivalent, hasSameDisplayName } from '../../sendSummary';

const docRef = firestore.collection('sendSummary').doc('current');

export function* sendSummaryFirstLoad() {
  const oldSummary = yield select(getSendSummary);
  if (!isEmpty(oldSummary)) return;
  const newDoc = yield call([docRef, 'get']);
  const newSummary = newDoc.data() || empty;
  yield put(toggleTab(0));
  yield put(syncSendSummary(newSummary));
}

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
}

const create = () => {
  const channel = eventChannel(emit => (
    docRef.onSnapshot((doc) => {
      emit({ doc });
    })
  ));

  function stop() {
    channel.close();
  }

  return { channel, handleEvent, stop };
};

export default create;
