import { all, call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { getSignedInUserId } from '../selectors';
import { showError, toggleLoading } from '../actions';
import { addUserDiff, hasUser, empty as emptySendSummary } from '../sendSummary';

import { firestore as db, docRef } from '../firebase';

function* submitDisplayNameUpdate(getFirebase, { payload: { displayName } }) {
  try {
    const uid = yield select(getSignedInUserId);
    const firebase = yield getFirebase();
    const userCollection = db.collection('users');
    const res = yield call([userCollection.where('displayName', '==', displayName), 'get']);

    if (res.size > 0) {
      yield put(showError('Nom déjà pris'));
    } else {
      const loadingId = generateLoadingId('submitDisplayNameUpdate');
      try {
        yield put(toggleLoading(true, loadingId));
        const summaryRef = docRef('sendSummary', 'current');
        yield all([
          call([firebase, 'updateProfile'], { displayName }),
          // Update name in send summary
          call([db, 'runTransaction'], transaction => (
            transaction.get(summaryRef).then((summaryDoc) => {
              const summary = summaryDoc.data() || emptySendSummary;
              if (hasUser(summary, uid)) {
                const summaryDiff = addUserDiff(summary, { uid, displayName });
                return transaction.set(summaryRef, summaryDiff, { merge: true });
              }
              return true;
            })
          )),
        ]);
      } finally {
        yield put(toggleLoading(false, loadingId));
      }
    }
  } catch (error) {
    console.log('submitDisplayNameUpdate error', error);
    yield put(showError(error));
  }
}

export default submitDisplayNameUpdate;
