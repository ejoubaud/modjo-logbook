import { all, call, put, select } from 'redux-saga/effects';

import { clearSectors, toggleLoading, showError, rollback } from '../actions';
import { getSendSubmitStates } from '../selectors';
import { firestore as db } from '../firebase';
import * as sendMapUtils from '../sendMap';
import * as sendListUtils from '../sendList';
import { colorKeys as allColors } from '../colors';
import { createSends } from '../send';

const docRef = (collection, docId) => db.collection(collection).doc(docId);

function* submitClears() {
  const { sectorIds, sendMap, sendList, signedInUser } = yield select(getSendSubmitStates);
  // for sendList

  if (signedInUser) {
    const clearSends = createSends({ sectorIds, type: 'clear', userId: signedInUser.uid });
    yield put(clearSectors(clearSends));
    try {
      yield put(toggleLoading(true));

      const { uid } = signedInUser;
      const sendMapDiff = sendMapUtils.populateWith(
        sendMapUtils.empty, allColors, sectorIds, db.FieldValue.delete(),
      );
      const sendListDiff = sendListUtils.addAllDiff(sendList, clearSends);
      // these go into the clear collection, while clearSends go into the sendList doc
      const clears = sectorIds.map(sectorId => (
        { userId: uid, sectorId, createdAt: new Date() }
      ));

      // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
      try {
        yield all([
          ...clears.map(clear => call([db.collection('clears'), 'add'], clear)),
          call([docRef('sendMaps', uid), 'set'], sendMapDiff, { merge: true }),
          call([docRef('sendLists', uid), 'set'], sendListDiff, { merge: true }),
        ]);
      } catch (error) {
        yield put(rollback({ sendMap, error }));
      }
    } finally {
      yield put(toggleLoading(false));
    }
  } else {
    const clearSends = createSends({ sectorIds, type: 'clear' });
    yield put(clearSectors(clearSends));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

export default submitClears;
