import { eventChannel } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { firestore } from '../../firebase';
import { getSendSummary } from '../../selectors';
import { syncSendSummary, showError } from '../../actions';
import { isEmpty, isEquivalent } from '../../sendSummary';

const docRef = firestore.collection('sendSummary').doc('current');

export function* sendSummaryFirstLoad() {
  const oldDoc = yield select(getSendSummary);
  if (!isEmpty(oldDoc)) return;
  const newDoc = yield call([docRef, 'get']);
  yield put(syncSendSummary(newDoc.data()));
}

function* handleEvent({ doc }) {
  const newDoc = doc.data();
  if (doc.exists) {
    const oldDoc = yield select(getSendSummary);
    if (!isEquivalent(newDoc, oldDoc)) {
      console.log('sendSummary discrepancy', oldDoc, newDoc);
      yield put(syncSendSummary(newDoc));
      if (!isEmpty(oldDoc)) yield put(showError('Liste de vos blocs enchaînés synchronisée depuis le serveur'));
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
