import { all, call, put, select } from 'redux-saga/effects';

import { clearSectors, toggleLoading, showError, rollback } from '../actions';
import { getSendSubmitStates } from '../selectors';
import { firestore as db } from '../firebase';
import * as sendMapUtils from '../sendMap';
import { colorKeys as allColors } from '../colors';

const docRef = (collection, docId) => db.collection(collection).doc(docId);

function* submitClears() {
  const { sectorIds, sendMap, signedInUser } = yield select(getSendSubmitStates);

  if (signedInUser) {
    yield put(clearSectors(sectorIds));
    yield put(toggleLoading(true));

    const { uid } = signedInUser;
    const sendMapDiff = sendMapUtils.populateWith(
      sendMapUtils.empty, allColors, sectorIds, db.FieldValue.delete(),
    );
    const clears = sectorIds.map(sectorId => (
      { userId: uid, sectorId, createdAt: new Date() }
    ));

    // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
    try {
      yield all([
        ...clears.map(clear => call([db.collection('clears'), 'add'], clear)),
        call([docRef('sendMaps', uid), 'set'], sendMapDiff, { merge: true }),
      ]);
    } catch (error) {
      yield put(rollback({ sendMap, error }));
    }
    yield put(toggleLoading(false));
  } else {
    yield put(clearSectors(sectorIds));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitClears;
