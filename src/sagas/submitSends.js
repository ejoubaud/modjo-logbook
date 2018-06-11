import { all, call, put, select } from 'redux-saga/effects';

import { sendBoulders, toggleLoading, showError, rollback } from '../actions';
import { getSendSubmitStates } from '../selectors';
import { firestore as db } from '../firebase';
import { createSends } from '../send';
import * as sendMapUtils from '../sendMap';
import * as sendListUtils from '../sendList';

const docRef = (collection, docId) => db.collection(collection).doc(docId);

function* submitSends({ payload: { type } }) {
  const { color, sectorIds, sendMap, sendList, signedInUser } = yield select(getSendSubmitStates);

  if (signedInUser) {
    const sends = createSends({ color, type, sectorIds, userId: signedInUser.uid });
    yield put(sendBoulders(sends));
    try {
      yield put(toggleLoading(true));

      const sendMapDiff = sendMapUtils.addAll(sendMapUtils.empty, sends);
      const sendListDiff = sendListUtils.addAllDiff(sendList, sends);

      const { uid } = signedInUser;
      // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
      try {
        yield all([
          ...sends.map(send => call([docRef('sends', send.id), 'set'], send)),
          call([docRef('sendMaps', uid), 'set'], sendMapDiff, { merge: true }),
          call([docRef('sendLists', uid), 'set'], sendListDiff, { merge: true }),
        ]);
      } catch (error) {
        yield put(rollback({ sendMap, sendList, error }));
      }
    } finally {
      yield put(toggleLoading(false));
    }
  } else {
    const sends = createSends({ color, type, sectorIds });
    yield put(sendBoulders(sends));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitSends;
