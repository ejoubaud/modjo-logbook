// Send maps store the latest state of each color/sector pair (sent or not)
import get from 'lodash/fp/get';
import setWith from 'lodash/fp/setWith';
import unset from 'lodash/fp/unset';
import curry from 'lodash/fp/curry';
import reduce from 'lodash/fp/reduce';
import union from 'lodash/fp/union';
import keys from 'lodash/fp/keys';
import some from 'lodash/fp/some';
import mapValues from 'lodash/fp/mapValues';
import omit from 'lodash/fp/omit';
import flatMap from 'lodash/fp/flatMap';
import map from 'lodash/fp/map';
import _isEmpty from 'lodash/fp/isEmpty';

const product = (a1, a2) => flatMap(e1 => map(e2 => [e1, e2], a2), a1);

export const empty = {};

export const isEmpty = _isEmpty;

export const add = (sendMap, send, value = send) => (
  // setWith(Object) ensures it works with num indices
  setWith(Object, [send.color, send.sectorId], value, sendMap)
);

export const addAll = (sendMap, sends) => (
  reduce(add, sendMap, sends)
);

export const populateWith = (sendMap, colors, sectorIds, value) => (
  reduce(
    (sendMap, [color, sectorId]) => add(sendMap, { color, sectorId }, value),
    sendMap,
    product(colors, sectorIds),
  )
);

// not used anymore (we clear sectors now, not just boulders)
export const remove = (sendMap, color, sectorId) => (
  unset([color, sectorId], sendMap)
);

// not used anymore (we clear sectors now, not just boulders)
export const removeSectorsInColor = (sendMap, color, sectorIds) => (
  reduce((map, sector) => remove(map, color, sector), sendMap, sectorIds)
);

export const removeSectors = (sendMap, sectorIds) => (
  mapValues(
    colorSectors => omit(sectorIds, colorSectors),
    sendMap,
  )
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
