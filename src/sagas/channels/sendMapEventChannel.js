import { eventChannel } from 'redux-saga';
import { put, select } from 'redux-saga/effects';

import { firestore } from '../../firebase';
import { getSendMap } from '../../selectors';
import { syncSendMap, showError } from '../../actions';
import { isEmpty, isEquivalent, empty } from '../../sendMap';

function* handleEvent({ doc }) {
  const newDoc = doc.data();
  if (doc.exists) {
    const oldDoc = yield select(getSendMap);
    if (!isEquivalent(newDoc, oldDoc)) {
      yield put(syncSendMap(newDoc));
      if (!isEmpty(oldDoc)) yield put(showError('Carte des blocs synchronisée depuis le serveur'));
    }
  }
}

const create = (user) => {
  const channel = eventChannel(emit => (
    firestore.collection('sendMaps').doc(user.uid).onSnapshot((doc) => {
      emit({ doc });
    })
  ));

  function* stop() {
    channel.close();
    if (!isEmpty(yield select(getSendMap))) yield put(syncSendMap(empty));
  }

  return { channel, handleEvent, stop };
};

export default create;
