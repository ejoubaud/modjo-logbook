import { all, call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { removeSend, toggleLoading, showError, rollback } from '../actions';
import { firestore as db, docRef, deletionMarker } from '../firebase';
import * as sendMapUtils from '../sendMap';
import * as sendListUtils from '../sendList';
import * as sendSummaryUtils from '../sendSummary';
import { getSignedInUser, getSendSummaries } from '../selectors';

function* submitSendDeletion({ payload: { send } }) {
  const signedInUser = yield select(getSignedInUser);
  const { sendList, sendMap } = yield select(getSendSummaries);
  const { color, sectorId } = send;

  if (signedInUser) {
    const loadingId = generateLoadingId('submitSendDeletion');
    yield put(removeSend(send));
    try {
      yield put(toggleLoading(true, loadingId));

      const sendMapDiff = sendMapUtils.populateWith(
        sendMapUtils.empty,
        [color],
        [sectorId],
        deletionMarker,
      );

      const { uid } = signedInUser;
      try {
        // Firestore has no cross-doc trx ; call sendList trx before as it can fail
        yield all([
          call([db, 'runTransaction'], transaction => (
            transaction.get(docRef('sendLists', uid)).then((sendListDoc) => {
              const latestSendList = sendListDoc.data() || sendListUtils.empty;
              const sendListDiff = sendListUtils.removeDiff(latestSendList, send, deletionMarker);
              return transaction.set(sendListDoc.ref, sendListDiff, { merge: true });
            })
          )),
          call([db, 'runTransaction'], transaction => (
            transaction.get(docRef('sendSummary', 'current')).then((summaryDoc) => {
              const latestSummary = summaryDoc.data() || sendSummaryUtils.empty;
              const summaryDiff = sendSummaryUtils.removeDiff(latestSummary, send, deletionMarker);
              return transaction.set(summaryDoc.ref, summaryDiff, { merge: true });
            })
          )),
          call([docRef('sends', send.id), 'delete']),
          call([docRef('sendMaps', uid), 'set'], sendMapDiff, { merge: true }),
        ]);
      } catch (error) {
        console.log('submitSendDeletion error', error);
        yield put(rollback({ sendMap, sendList, error }));
      }
    } finally {
      yield put(toggleLoading(false, loadingId));
    }
  } else {
    yield put(removeSend(send));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitSendDeletion;
