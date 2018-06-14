import { all, call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { sendBoulders, toggleLoading, showError, rollback } from '../actions';
import { getSendSubmitStates } from '../selectors';
import { firestore as db, docRef } from '../firebase';
import { createSends } from '../send';
import * as sendMapUtils from '../sendMap';
import * as sendListUtils from '../sendList';

function* submitSends({ payload: { type } }) {
  const { color, sectorIds, sendMap, sendList, signedInUser } = yield select(getSendSubmitStates);

  if (signedInUser) {
    const loadingId = generateLoadingId('submitSends');
    const sends = createSends({ color, type, sectorIds, userId: signedInUser.uid });
    yield put(sendBoulders(sends));
    try {
      yield put(toggleLoading(true, loadingId));

      const sendMapDiff = sendMapUtils.addAll(sendMapUtils.empty, sends);

      const { uid } = signedInUser;
      try {
        // Firestore has no cross-doc trx ; call sendList trx before as it can fail
        yield call([db, 'runTransaction'], transaction => (
          transaction.get(docRef('sendLists', uid)).then((sendListDoc) => {
            const latestSendList = sendListDoc.data() || sendListUtils.empty;
            const sendListDiff = sendListUtils.addAllDiff(latestSendList, sends);
            return transaction.set(sendListDoc.ref, sendListDiff, { merge: true });
          })
        ));
        yield all([
          ...sends.map(send => call([docRef('sends', send.id), 'set'], send)),
          call([docRef('sendMaps', uid), 'set'], sendMapDiff, { merge: true }),
        ]);
      } catch (error) {
        console.log('submitSends error', error);
        yield put(rollback({ sendMap, sendList, error }));
      }
    } finally {
      yield put(toggleLoading(false, loadingId));
    }
  } else {
    const sends = createSends({ color, type, sectorIds });
    yield put(sendBoulders(sends));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitSends;
