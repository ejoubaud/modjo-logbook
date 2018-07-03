import { call, put } from 'redux-saga/effects';

import { firestore as db, docRef } from '../firebase';
import { showError, syncSendSummary } from '../actions';
import * as summaryUtils from '../sendSummary';

export const threshold = 1000;
const targetLength = 500;

const trimNotice = `
Les actus ont atteint la longueur maximale de ${threshold} lignes,
elles ont été tronquées pour ne conserver que les ${targetLength} derniers
passages. Le reste ne sera plus visible dans les actus mais le restera
dans les logbooks de chaque grimpeur.
`;

const splitSummaryWithArchiveId = (summary) => {
  const [trimmedSummary, archiveSummary] = summaryUtils.split(summary, targetLength);

  const previousArchiveId = summary.nextArchive;
  if (previousArchiveId) archiveSummary.nextArchive = summary.nextArchive;
  const newArchiveId = (previousArchiveId || 0) + 1;
  trimmedSummary.nextArchive = newArchiveId;

  return { trimmedSummary, archiveSummary };
};

export default function* trimSendSummary() {
  let newSummary;

  yield call([db, 'runTransaction'], (transaction) => {
    const currentRef = docRef('sendSummary', 'current');
    return transaction.get(currentRef).then((sendSummaryDoc) => {
      const summary = sendSummaryDoc.data();
      if (!summary || summaryUtils.size(summary) < threshold) return Promise.resolve('No send list to trim');

      const { trimmedSummary, archiveSummary } = splitSummaryWithArchiveId(summary);
      newSummary = trimmedSummary;
      const archiveDocId = `archive-${trimmedSummary.nextArchive}`;
      return transaction
        .set(docRef('archivedSendSummaries', archiveDocId), archiveSummary)
        .set(currentRef, trimmedSummary);
    });
  });

  if (newSummary) {
    yield put(syncSendSummary(newSummary)); // avoids the "synced from server msg"
    yield put(showError(trimNotice));
  }
}
