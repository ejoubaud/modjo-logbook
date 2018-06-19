import { all, call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { clearSectors, toggleLoading, showError, rollback } from '../actions';
import { getSendSubmitStates } from '../selectors';
import { firestore as db, docRef } from '../firebase';
import * as sendListUtils from '../sendList';
import { createSends } from '../send';

function* submitClears() {
  const { sectorIds, sendList, signedInUser } = yield select(getSendSubmitStates);
  // for sendList

  if (signedInUser) {
    const clearSends = createSends({ sectorIds, type: 'clear', userId: signedInUser.uid });
    const loadingId = generateLoadingId('submitClears');

    yield put(clearSectors(clearSends));
    try {
      yield put(toggleLoading(true, loadingId));

      const { uid } = signedInUser;

      try {
        // Firestore has no cross-doc trx ; call sendList trx before as it can fail
        yield all([
          call([db, 'runTransaction'], transaction => (
            transaction.get(docRef('sendLists', uid)).then((sendListDoc) => {
              const latestSendList = sendListDoc.data() || sendListUtils.empty;
              const sendListDiff = sendListUtils.addAllDiff(latestSendList, clearSends);
              return transaction.set(sendListDoc.ref, sendListDiff, { merge: true });
            })
          )),
          ...clearSends.map(send => call([docRef('clears', send.id), 'set'], send)),
        ]);
      } catch (error) {
        console.log('submitClears error', error);
        yield put(rollback({ sendList, error }));
      }
    } finally {
      yield put(toggleLoading(false, loadingId));
    }
  } else {
    const clearSends = createSends({ sectorIds, type: 'clear' });
    yield put(clearSectors(clearSends));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitClears;
