import { put, select, call } from 'redux-saga/effects';

import { initChannelWithFirstLoad } from '../utils';
import { firestore } from '../../firebase';
import { getSendList } from '../../selectors';
import { STOP_SEND_LIST_SYNC, syncSendList, showError } from '../../actions';
import { isEmpty, isEquivalent } from '../../sendList';


function* handleEvent({ doc }) {
  const newDoc = doc.data();
  if (doc.exists) {
    const oldDoc = yield select(getSendList);
    if (!isEquivalent(newDoc, oldDoc)) {
      console.log('sendList discrepancy', oldDoc, newDoc);
      yield put(syncSendList(newDoc));
      if (!isEmpty(oldDoc)) yield put(showError('Historique de vos blocs synchronisé depuis le serveur'));
    }
  }
}

export default function* start({ payload: { userId } }) {
  yield call(initChannelWithFirstLoad, 'sendListSync', STOP_SEND_LIST_SYNC, handleEvent, emit => (
    firestore.collection('sendLists').doc(userId).onSnapshot((doc) => {
      emit({ doc });
    })
  ));
}
