import { all, call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { removeSend, toggleLoading, showError, rollback } from '../actions';
import { firestore as db, docRef, deletionMarker } from '../firebase';
import { getSignedInUserId, getSendList } from '../selectors';
import { isClear } from '../send';
import * as sendListUtils from '../collections/sendList';
import * as sendSummaryUtils from '../collections/sendSummary';

function* submitSendDeletion({ payload: { send } }) {
  const signedInUserId = yield select(getSignedInUserId);
  const sendList = yield select(getSendList);

  if (signedInUserId) {
    const loadingId = generateLoadingId('submitSendDeletion');
    const table = isClear(send) ? 'clears' : 'sends';

    yield put(removeSend(send));
    try {
      yield put(toggleLoading(true, loadingId));

      try {
        // Firestore has no cross-doc trx ; call sendList trx before as it can fail
        yield all([
          call([db, 'runTransaction'], transaction => (
            transaction.get(docRef('sendLists', signedInUserId)).then((sendListDoc) => {
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
          call([docRef(table, send.id), 'delete']),
        ]);
      } catch (error) {
        console.log('submitSendDeletion error', error);
        yield put(rollback({ sendList, error }));
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
