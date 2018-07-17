import { all, call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { sendBoulders, toggleLoading, showError, rollback } from '../actions';
import { getSendSubmitStates } from '../selectors';
import { firestore as db, docRef } from '../firebase';
import * as sendListUtils from '../collections/sendList';
import * as sendSummaryUtils from '../collections/sendSummary';
import { createSends } from '../models/send';
import mockUser from '../models/mockUser';

function* submitSends({ payload: { type } }) {
  const {
    color,
    sectorIds,
    funRating,
    difficultyRating,
    sendList,
    signedInUser,
  } = yield select(getSendSubmitStates);

  if (signedInUser) {
    const loadingId = generateLoadingId('submitSends');
    const sends = createSends({
      color,
      type,
      sectorIds,
      funRating,
      difficultyRating,
      userId: signedInUser.uid,
    });

    yield put(sendBoulders(sends, signedInUser));

    try {
      yield put(toggleLoading(true, loadingId));

      const { uid } = signedInUser;
      try {
        // === Firestore has no cross-doc trx, so independent trxs for list/summary
        yield all([
          call([db, 'runTransaction'], transaction => (
            transaction.get(docRef('sendLists', uid)).then((sendListDoc) => {
              const latestSendList = sendListDoc.data() || sendListUtils.empty;
              const sendListDiff = sendListUtils.addAllDiff(latestSendList, sends);
              return transaction.set(sendListDoc.ref, sendListDiff, { merge: true });
            })
          )),
          call([db, 'runTransaction'], transaction => (
            transaction.get(docRef('sendSummary', 'current')).then((summaryDoc) => {
              const latestSummary = summaryDoc.data() || sendSummaryUtils.empty;
              const summaryDiff = sendSummaryUtils.addAllDiff(latestSummary, sends, signedInUser);
              return transaction.set(summaryDoc.ref, summaryDiff, { merge: true });
            })
          )),
          ...sends.map(send => call([docRef('sends', send.id), 'set'], send)),
        ]);
      } catch (error) {
        console.log('submitSends error', error);
        yield put(rollback({ sendList, error }));
      }
    } finally {
      yield put(toggleLoading(false, loadingId));
    }
  } else {
    const sends = createSends({ color, type, sectorIds });
    yield put(sendBoulders(sends, mockUser));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitSends;
