import { all, call, put, select } from 'redux-saga/effects';

import { removeSend, toggleLoading, showError, rollback } from '../actions';
import { firestore as db } from '../firebase';
import * as sendMapUtils from '../sendMap';
import * as sendListUtils from '../sendList';
import { getSignedInUser, getSendSummaries } from '../selectors';

const docRef = (collection, docId) => db.collection(collection).doc(docId);

function* submitSendDeletion({ payload: { send } }) {
  const signedInUser = yield select(getSignedInUser);
  const { sendList, sendMap } = yield select(getSendSummaries);
  const { color, sectorId } = send;

  if (signedInUser) {
    yield put(removeSend(send));
    try {
      yield put(toggleLoading(true));

      const sendMapDiff = sendMapUtils.populateWith(
        sendMapUtils.empty,
        [color],
        [sectorId],
        db.FieldValue.delete(),
      );
      const sendListDiff = sendListUtils.removeDiff(sendList, send);

      const { uid } = signedInUser;
      // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
      try {
        yield all([
          call([docRef('sends', send.id), 'delete']),
          call([docRef('sendMaps', uid), 'set'], sendMapDiff, { merge: true }),
          call([docRef('sendLists', uid), 'set'], sendListDiff, { merge: true }),
        ]);
      } catch (error) {
        console.log('submitSendDeletion error', error);
        yield put(rollback({ sendMap, sendList, error }));
      }
    } finally {
      yield put(toggleLoading(false));
    }
  } else {
    yield put(removeSend(send));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitSendDeletion;
