import { put, select, call } from 'redux-saga/effects';

import { initChannelWithFirstLoad } from '../utils';
import { threshold as trimThreshold } from '../submitSendListTrim';
import { firestore } from '../../firebase';
import { getSendList, getSignedInUserId, getIsSpyModeOn } from '../../selectors';
import { STOP_SEND_LIST_SYNC, syncSendList, showError, submitSendListTrim } from '../../actions';
import { isEmpty, isEquivalent, size } from '../../collections/sendList';

function* handleEvent({ doc }) {
  const newDoc = doc.data();
  if (doc.exists) {
    const oldDoc = yield select(getSendList);
    if (!isEquivalent(newDoc, oldDoc)) {
      console.log('sendList discrepancy', oldDoc, newDoc);
      yield put(syncSendList(newDoc));
      if (!isEmpty(oldDoc)) yield put(showError('Historique de vos blocs synchronisé depuis le serveur'));
    }

    const isSignedIn = yield select(getSignedInUserId);
    const isSpyMode = yield select(getIsSpyModeOn);
    if (isSignedIn && !isSpyMode && size(newDoc) >= trimThreshold) yield put(submitSendListTrim());
  }
}

export default function* start({ payload: { userId } }) {
  yield call(initChannelWithFirstLoad, 'sendListSync', STOP_SEND_LIST_SYNC, handleEvent, emit => (
    firestore.collection('sendLists').doc(userId).onSnapshot((doc) => {
      emit({ doc });
    })
  ));
}
