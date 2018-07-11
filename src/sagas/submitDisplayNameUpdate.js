import { call, put } from 'redux-saga/effects';

import { generateLoadingId } from './utils';
import submitSendSummaryUserUpdate from './submitSendSummaryUserUpdate';
import { showError, toggleLoading } from '../actions';

import { firestore as db } from '../firebase';

function* submitDisplayNameUpdate(getFirebase, { payload: { displayName } }) {
  try {
    const firebase = yield getFirebase();
    const userCollection = db.collection('users');
    const res = yield call([userCollection.where('displayName', '==', displayName), 'get']);

    if (res.size > 0) {
      yield put(showError('Nom déjà pris'));
    } else {
      const loadingId = generateLoadingId('submitDisplayNameUpdate');
      try {
        yield put(toggleLoading(true, loadingId));

        yield call([firebase, 'updateProfile'], { displayName });
        yield call(submitSendSummaryUserUpdate);
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
