// List of functions to manage the sendMap state in Redux
import get from 'lodash/fp/get';
import setWith from 'lodash/fp/setWith';
import unset from 'lodash/fp/unset';
import curry from 'lodash/fp/curry';
import reduce from 'lodash/fp/reduce';
import union from 'lodash/fp/union';
import keys from 'lodash/fp/keys';
import some from 'lodash/fp/some';

export const empty = {};

export const add = (sendMap, send, value = send) => (
  // setWith(Object) ensures it works with num indices
  setWith(Object, [send.color, send.sectorId], value, sendMap)
);

export const addAll = (sendMap, sends) => (
  reduce(add, sendMap, sends)
);

export const populateWith = (sendMap, sends, value) => (
  reduce((sendMap, send) => add(sendMap, send, value), sendMap, sends)
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

export const isEquivalent = (map1, map2) => {
  const colors = union(keys(map1), keys(map2));
  return !some((color) => {
    const sectors = union(keys(map1[color]), keys(map2[color]));
    return some(sectorId => (
      isSent(map1, color, sectorId) !== isSent(map2, color, sectorId)
    ), sectors);
  }, colors);
};
