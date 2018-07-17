/* global Blob */
import { put, select, call } from 'redux-saga/effects';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { format } from 'date-fns';

import { generateLoadingId } from './utils';
import { getSignedInUserId, getSendList } from '../selectors';
import { toggleLoading } from '../actions';
import { docRef } from '../firebase';
import { empty as emptySendList, toList } from '../collections/sendList';
import { getLabel } from '../colors';
import { getDescription as getFunDescription } from '../funRatings';
import { getDescription as getDifficultyDescription } from '../difficultyRatings';
import { getDescription as getSendTypeDescription } from '../sendTypes';

const addSends = (allSends, sendList) => allSends.concat(toList(sendList));

const formatSend = ({ color, sectorId, type, createdAt, funRating, difficultyRating }) => ({
  couleur: getLabel(color),
  secteur: sectorId,
  type: getSendTypeDescription(type),
  fun: funRating,
  difficulté: difficultyRating,
  'fun (description)': getFunDescription(funRating),
  'difficulté (description)': getDifficultyDescription(difficultyRating),
  date: createdAt.toISOString(),
});

function* downloadSendListAsCsv() {
  const uid = yield select(getSignedInUserId);
  let allSends = [];
  let sendList = null;
  const loadingId = generateLoadingId('downloadSendListAsCsv');

  try {
    yield put(toggleLoading(true, loadingId));

    if (uid) {
      // if signed in, load all archives from DB
      let sendListDoc = yield call([docRef('sendLists', uid), 'get']);
      sendList = sendListDoc.data() || emptySendList;
      allSends = addSends(allSends, sendList);
      while (sendList.nextArchive) {
        const archiveDocId = `${uid}-${sendList.nextArchive}`;
        sendListDoc = yield call([docRef('archivedSendLists', archiveDocId), 'get']);
        sendList = sendListDoc.data() || emptySendList;
        allSends = addSends(allSends, sendList);
      }
    } else {
      sendList = yield select(getSendList);
      allSends = addSends(allSends, sendList);
    }

    const formattedSends = allSends.map(formatSend);

    const csv = Papa.unparse(formattedSends);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    FileSaver.saveAs(blob, `Modjo_logbook_${format(new Date(), 'YYYYMMDD_HHmm')}.csv`);
  } finally {
    yield put(toggleLoading(false, loadingId));
  }
}

export default downloadSendListAsCsv;
