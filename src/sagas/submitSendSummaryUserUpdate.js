import { call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { getSignedInUserId, getSendSummary } from '../selectors';
import { showError, toggleLoading } from '../actions';
import { firestore as db, docRef } from '../firebase';
import { addUserDiff, hasUser, empty as emptySendSummary } from '../collections/sendSummary';

const baseErrorMsg = 'Impossible de mettre à jour vos actus avec le nouveau profil';
const userNotFoundInDbErrorMsg = `${baseErrorMsg}: utilisateur introuvable dans la base de données.`;
const userNotFoundInSummaryMsg = `${baseErrorMsg}: utilisateur introuvable dans les actus.`;

function* submitSendSummaryUserUpdate() {
  const uid = yield select(getSignedInUserId);
  const summary = yield select(getSendSummary);

  if (uid && summary && hasUser(summary, uid)) {
    const summaryRef = docRef('sendSummary', 'current');
    const loadingId = generateLoadingId('submitSendSummaryUserUpdate');

    try {
      yield put(toggleLoading(true, loadingId));

      const userDoc = yield call([docRef('users', uid), 'get']);
      const user = userDoc.data();
      if (!user) throw new Error(userNotFoundInDbErrorMsg);
      const { displayName, photoURL } = user;

      yield call([db, 'runTransaction'], transaction => (
        transaction.get(summaryRef).then((summaryDoc) => {
          const summary = summaryDoc.data() || emptySendSummary;
          if (!hasUser(summary, uid)) return Promise.reject(new Error(userNotFoundInSummaryMsg));
          const summaryDiff = addUserDiff(summary, { uid, displayName, photoURL });
          return transaction.set(summaryRef, summaryDiff, { merge: true });
        })
      ));
    } catch (error) {
      console.log('submitSendSummaryUserUpdate error', error);
      yield put(showError(error));
    } finally {
      yield put(toggleLoading(false, loadingId));
    }
  }
}

export default submitSendSummaryUserUpdate;
