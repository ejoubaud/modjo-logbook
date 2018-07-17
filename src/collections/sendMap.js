// Send maps store the latest state of each color/sector pair (sent or not)
import get from 'lodash/fp/get';
import curry from 'lodash/fp/curry';
import maxBy from 'lodash/fp/maxBy';
import values from 'lodash/fp/values';
import compose from 'lodash/fp/compose';

import { isClear } from '../models/send';

export const isSent = curry((sendMap, color, sectorId) => {
  const send = get([sectorId, color], sendMap);
  return send && !isClear(send);
});

export const lastSendForSector = (sendMap, sectorId) => (
  compose(
    maxBy(send => send.createdAt),
    values,
  )(sendMap[sectorId])
);
