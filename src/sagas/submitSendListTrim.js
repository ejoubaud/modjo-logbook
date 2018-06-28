import { call, select } from 'redux-saga/effects';

import { firestore as db, docRef } from '../firebase';
import { getSignedInUserId } from '../selectors';
import * as sendListUtils from '../sendList';

export const threshold = 10;
const targetLength = 5;

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

  yield call([db, 'runTransaction'], (transaction) => {
    const currentRef = docRef('sendLists', uid);
    return transaction.get(currentRef).then((sendListDoc) => {
      const sendList = sendListDoc.data();
      if (!sendList || sendListUtils.size(sendList) > 0) return Promise.resolve('No send list to trim');

      const { trimmedSendList, archiveSendList } = splitListWithArchiveId(sendList);
      const archiveDocId = `${uid}-${trimmedSendList.nextArchive}`;
      return transaction
        .set(docRef('archivedSendLists', archiveDocId), archiveSendList)
        .set(currentRef, trimmedSendList);
    });
  });
}
