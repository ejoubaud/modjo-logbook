import { eventChannel } from 'redux-saga';
import { put, select } from 'redux-saga/effects';

import { firestore } from '../../firebase';
import { getSendList } from '../../selectors';
import { syncSendList, showError } from '../../actions';
import { isEmpty, isEquivalent, empty } from '../../sendList';

function* handleEvent({ doc }) {
  const newDoc = doc.data();
  if (doc.exists) {
    const oldDoc = yield select(getSendList);
    if (!isEquivalent(newDoc, oldDoc)) {
      yield put(syncSendList(newDoc));
      if (!isEmpty(oldDoc)) yield put(showError('Liste de blocs enchaînés synchronisée depuis le serveur'));
    }
  }
}

const create = (user) => {
  const channel = eventChannel(emit => (
    firestore.collection('sendLists').doc(user.uid).onSnapshot((doc) => {
      emit({ doc });
    })
  ));

  function* stop() {
    channel.close();
    if (!isEmpty(yield select(getSendList))) yield put(syncSendList(empty));
  }

  return { channel, handleEvent, stop };
};

export default create;
