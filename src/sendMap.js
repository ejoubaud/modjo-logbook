// Send maps store the latest state of each color/sector pair (sent or not)
import get from 'lodash/fp/get';
import curry from 'lodash/fp/curry';

export const isSent = curry((sendMap, color, sectorId) => {
  const send = get([sectorId, color], sendMap);
  return send && send.type !== 'clear';
});
