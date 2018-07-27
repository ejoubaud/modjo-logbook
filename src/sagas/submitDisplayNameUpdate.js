import { call, put, select } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import { getSignedInUser } from '../selectors';
import { showError, toggleLoading, submitSendSummaryUserUpdate } from '../actions';

import { firestore as db } from '../firebase';

function* submitDisplayNameUpdate({ payload: { displayName } }) {
  try {
    const userCollection = db.collection('users');
    const user = yield select(getSignedInUser);
    const res = yield call([userCollection.where('displayNameOverride', '==', displayName), 'get']);

    if (res.size > 0) {
      yield put(showError('Nom déjà pris'));
    } else {
      const loadingId = generateLoadingId('submitDisplayNameUpdate');
      try {
        yield put(toggleLoading(true, loadingId));
        yield call([userCollection.doc(user.uid), 'set'], { displayNameOverride: displayName }, { merge: true });
        yield put(submitSendSummaryUserUpdate());
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
