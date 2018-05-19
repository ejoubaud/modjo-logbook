// List of functions to manage the sendMap state in Redux
import get from 'lodash/fp/get';
import setWith from 'lodash/fp/setWith';
import unset from 'lodash/fp/unset';
import curry from 'lodash/fp/curry';
import reduce from 'lodash/fp/reduce';

export const empty = {};

export const add = (sendMap, send) => (
  // setWith(Object) ensures it works with num indices
  setWith(Object, [send.color, send.sectorId], send, sendMap)
);

export const addAll = (sendMap, sends) => (
  reduce(add, sendMap, sends)
);

export const remove = (sendMap, color, sectorId) => (
  unset([color, sectorId], sendMap)
);

export const removeAll = (sendMap, color, sectorIds) => (
  reduce((map, sector) => remove(map, color, sector), sendMap, sectorIds)
);

export const isSent = curry((sendMap, color, sectorId) => (
  !!get([color, sectorId], sendMap)
));
