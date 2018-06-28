import { call, select, put } from 'redux-saga/effects';

import { firestore as db, docRef } from '../firebase';
import { getSignedInUserId } from '../selectors';
import { showError, syncSendList } from '../actions';
import * as sendListUtils from '../sendList';

export const threshold = 10;
const targetLength = 5;

const trimNotice = `
Votre logbook a atteint la longueur maximale de ${threshold} lignes,
il a été tronqué pour ne conserver que les ${targetLength} derniers
passages. Le reste a été archivé mais ne sera plus accessible depuis
l'interface. Contacter un administrateur pour les récupérer.
`;

const splitListWithArchiveId = (sendList) => {
  const [trimmedSendList, archiveSendList] = sendListUtils.split(sendList, targetLength);

  const previousArchiveId = sendList.nextArchive;
  if (previousArchiveId) archiveSendList.nextArchive = sendList.nextArchive;
  const newArchiveId = (previousArchiveId || 0) + 1;
  trimmedSendList.nextArchive = newArchiveId;

  return { trimmedSendList, archiveSendList };
};

export default function* trimSendList() {
  const uid = yield select(getSignedInUserId);
  let newSendList;

  yield call([db, 'runTransaction'], (transaction) => {
    const currentRef = docRef('sendLists', uid);
    return transaction.get(currentRef).then((sendListDoc) => {
      const sendList = sendListDoc.data();
      if (!sendList || sendListUtils.size(sendList) < threshold) return Promise.resolve('No send list to trim');

      const { trimmedSendList, archiveSendList } = splitListWithArchiveId(sendList);
      newSendList = trimmedSendList;
      const archiveDocId = `${uid}-${trimmedSendList.nextArchive}`;
      return transaction
        .set(docRef('archivedSendLists', archiveDocId), archiveSendList)
        .set(currentRef, trimmedSendList);
    });
  });
  if (newSendList) {
    yield put(syncSendList(newSendList)); // avoids the "synced from server msg"
    yield put(showError(trimNotice, { displayDuration: null }));
  }
}
