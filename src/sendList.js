/* eslint no-multi-spaces: ["warn", { ignoreEOLComments: true }] */
/* eslint no-mixed-operators: ["warn", {"allowSamePrecedence": true}] */

// Send lists store a lot of sends in a single Firestore doc to limit (billed) DB read
// Since Firestore docs can't contain arrays, we implement a chained list with object
// Each list references its first elem. Each node wraps a send and a reference to next
// The list also keeps a count for integrity checks to spot and fix concurrency corruptions
//
// Small keys to keep Firestore storage limits at bay
// h: head (first)
// $: last
// i: id
// l: list
// n: next
// e: elem (send)
// c: color
// s: sectorId
// t: type
// d: date
// u: userId
// #: count
//
// Sends are ordered by last added first (fifo)
import map from 'lodash/fp/map';
import toPairs from 'lodash/fp/toPairs';
import fromPairs from 'lodash/fp/fromPairs';
import compose from 'lodash/fp/compose';
import compact from 'lodash/fp/compact';
import every from 'lodash/fp/every';
import keys from 'lodash/fp/keys';
import filter from 'lodash/fp/filter';
import reduce from 'lodash/fp/reduce';
import unset from 'lodash/fp/unset';
import _isEmpty from 'lodash/fp/isEmpty';

import colors, { colorKeys as allColorKeys } from './colors';
import sendTypes from './send-types';
import { generateSendId } from './send';

// home-made obj-based Set with wide browser support
const toSet = compose(
  fromPairs,
  map(v => [v, true]),
);

const id = v => v;

const toDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val.toDate === 'function') return val.toDate();
  return null;
};
const compressColor = color => colors[color].abbrev;

const compressType = type => sendTypes[type].abbrev;

const sortByAbbrev = compose(
  fromPairs,
  map(([key, { abbrev }]) => [abbrev, key]),
  toPairs,
);
const colorsByAbbrev = sortByAbbrev(colors);
const typesByAbbrev = sortByAbbrev(sendTypes);

const uncompressColor = abbrev => colorsByAbbrev[abbrev];
const uncompressType = abbrev => typesByAbbrev[abbrev];

const compressSend = ({ color, sectorId, type, userId, createdAt }) => (
  Object.assign(
    {},
    color && { c: compressColor(color) },
    userId && { u: userId },
    { s: sectorId, t: compressType(type), d: createdAt },
  )
);
const uncompressSend = ({ c, s, t, d, u }, id) => (
  Object.assign(
    {},
    c && { color: uncompressColor(c) },
    u && { userId: u },
    { id, sectorId: s, type: uncompressType(t), createdAt: toDate(d) },
  )
);

// set unused fields to null to avoid Firestore failure when
// trying to save an 'undefined' value, in case the undefined gets copied
export const empty = { '#': 0, l: {}, h: null, $: null };

export const isEmpty = ({ l }) => !l || _isEmpty(l);

export const size = sendList => sendList['#'];

// low-level iterator on the chained list, returns an array of sends
const select = (sendList, filterCb, opts = {}) => {
  const { until = () => false } = opts;
  if (!sendList) return [];
  const { l, h } = sendList;
  if (!(l || h)) return [];
  let id = h;
  const res = [];
  while (id) {
    const node = l[id];
    const compressedSend = node.e;
    if (filterCb(compressedSend, id, node)) res.push([compressedSend, id, node]);
    if (until(res)) break;
    id = node.n;
  }
  return res;
};

const selectFirst = (sendList, filterCb) => (
  select(sendList, filterCb, { until: res => res.length > 0 })[0]
);

const clearAbbrev = compressType('clear');

// assumes send is somewhere in sendList
export const wasSectorClearedSince = (sendList, send) => {
  const [lastClearOrThisSend] = selectFirst(sendList, (s, id) => (
    s.s === send.sectorId && (s.t === clearAbbrev || id === send.id)
  ));
  return lastClearOrThisSend.t === clearAbbrev;
};

// not used anymore
// assumes send is somewhere in sendList
export const wasSectorSentSince = (sendList, send) => {
  const [lastSendOrThisClear] = selectFirst(sendList, (s, id) => (
    s.s === send.sectorId && (s.t !== clearAbbrev || id === send.id)
  ));
  return lastSendOrThisClear.t !== clearAbbrev;
};

export const hasOneByUserId = (sendList, userId) => (
  !!selectFirst(sendList, ({ u }) => u === userId)
);
export const hasSeveralByUserId = (sendList, userId) => (
  select(
    sendList,
    ({ u }) => u === userId,
    { until: res => res.length >= 2 },
  ).length >= 2
);

export const lastByColorForSector = (sendList, sectorId, colorKeys) => {
  let colorKeysLeft = toSet(colorKeys);
  let lastSendsByColor = {};
  select(
    sendList,
    (send, id) => {
      const { s, c, t } = send;
      if (s === sectorId && (t === 'clear' || colorKeysLeft[c])) {
        colorKeysLeft = unset(c, colorKeysLeft);
        lastSendsByColor = { ...lastSendsByColor, [c]: uncompressSend(send, id) };
        return true;
      }
      return false;
    },
    { until: res => res.length >= colorKeys.length },
  );
  return lastSendsByColor;
};

export const add = (sendList, send) => {
  const id = send.id || generateSendId();
  const { h, l, $ } = sendList;
  const count = size(sendList) || 0;
  return {
    '#': count + 1,
    h: id,      // head/first
    $: $ || id, // last
    l: {        // chained list implemented with obj
      ...l,
      [id]: { n: h || null, e: compressSend(send) },
    },
  };
};

export const addAll = (sendList, sends) => (
  reduce(add, sendList, sends)
);

// Returns an object to remove just the relevant fields from Firestore doc
export const removeDiff = (sendList, send, deletionMarker) => {
  const { id } = send;
  const { l, h, $ } = sendList;
  const currentNode = l[id];
  if (!currentNode) return {};
  const count = size(sendList);
  const deleteEntry = { [id]: deletionMarker };
  if (count === 1) return { ...empty, l: deleteEntry };
  if (h === id) {
    return {
      '#': count - 1,
      h: currentNode.n,
      l: deleteEntry,
    };
  }
  const [, previousSendId] = selectFirst(sendList, (_send, _id, node) => node.n === id);
  if ($ === id) {
    return {
      '#': count - 1,
      $: previousSendId,
      l: {
        ...deleteEntry,
        [previousSendId]: { n: null },
      },
    };
  }
  return {
    '#': count - 1,
    l: {
      ...deleteEntry,
      [previousSendId]: { n: currentNode.n },
    },
  };
};

export const remove = (sendList, send) => {
  const { id } = send;
  const { l, h, $ } = sendList;
  const currentNode = l[id];
  if (!currentNode) return {};
  const count = size(sendList);
  const removedL = unset(id, l);
  if (count === 1) return { ...empty, l: removedL };
  if (h === id) {
    return {
      ...sendList,
      '#': count - 1,
      h: currentNode.n,
      l: removedL,
    };
  }
  const [, previousSendId, previousNode] = selectFirst(
    sendList,
    (_send, _id, node) => node.n === id,
  );
  if ($ === id) {
    return {
      ...sendList,
      '#': count - 1,
      $: previousSendId,
      l: {
        ...removedL,
        [previousSendId]: { ...previousNode, n: null },
      },
    };
  }
  return {
    ...sendList,
    '#': count - 1,
    l: {
      ...removedL,
      [previousSendId]: { ...previousNode, n: currentNode.n },
    },
  };
};

// Counts elem intersection by id, faster if arg 1 is shorter
const countSharedIds = (sendList1, sendList2) => (
  compose(
    filter(id => sendList2.l[id]),
    keys,
  )(sendList1.l).length
);

// accepts either a list of send with id ([send1, send2, ...])
// or without [{id: id1, send: send1}, ...]
// returns an object to add just the relevant to Firestore doc, with deep merge
export const addAllDiff = (sendList, sends) => {
  const diffBase = addAll(empty, sends);
  const readditions = countSharedIds(diffBase, sendList);
  return {
    ...diffBase,
    $: sendList.$ || diffBase.$,
    '#': (size(sendList) || 0) + size(diffBase) - readditions,
    l: {
      ...diffBase.l,
      // link diffBase's last elem's next to the first elem of sendList
      [diffBase.$]: {
        ...diffBase.l[diffBase.$],
        n: sendList.h || null,
      },
    },
  };
};

export const applyAddDiff = (source, diff) => ({
  ...source,
  ...diff,
  l: { ...source.l, ...diff.l },
});

export const toList = sendList => (
  select(sendList, () => true).map(([send, id]) => uncompressSend(send, id))
);

export const split = (sendList, targetLength) => {
  const list = toList(sendList);
  const list1 = addAll(empty, list.slice(0, targetLength).reverse());
  const list2 = addAll(empty, list.slice(targetLength).reverse());
  return [list1, list2];
};

const makePageFilter = ({ abbrev, value, compressValue = id }) => {
  if (_isEmpty(value)) return null;
  const compressedValuesArray = map(compressValue, [].concat(value));
  const valuesSet = toSet(compressedValuesArray);
  // if send has no value for property (e.g. clear with no color),
  // consider it has all values and return true
  return elem => !elem[abbrev] || valuesSet[elem[abbrev]];
};

const combinePageFilters = (definitions) => {
  const filters = compose(
    compact,
    map(makePageFilter),
  )(definitions);
  return elem => every(filter => filter(elem), filters);
};

export const toSendMap = (sendList) => {
  const results = {};
  select(
    sendList,
    (send, id) => {
      const sectorId = send.s;
      // all color if no color/is clear
      const colorKeys = send.c ? [uncompressColor(send.c)] : allColorKeys;
      const sectorContent = results[sectorId] || {};
      colorKeys.forEach((c) => {
        if (!sectorContent[c]) sectorContent[c] = uncompressSend(send, id);
      });
      results[sectorId] = sectorContent;
    },
  );
  return results;
};

export const getPage = (sendList, { page = 1, pageSize = 10, colors = null, sectorIds = null }) => {
  const matchesFilters = combinePageFilters([
    { abbrev: 'c', value: colors, compressValue: compressColor },
    { abbrev: 's', value: sectorIds },
  ]);
  const offset = (page - 1) * pageSize;
  const limit = offset + pageSize;
  // if filtering occurs, must iterate over the whole list to count the total match count
  // if there's no filter, we can just use the cached length of the length
  const keepCounting = !(_isEmpty(colors) && _isEmpty(sectorIds));
  const until = keepCounting ? (() => false) : (res => res.length >= limit);
  const matches = select(sendList, matchesFilters, { until });
  const sends = matches
    .slice(offset, limit)
    .map(([compressed, id]) => uncompressSend(compressed, id));
  return {
    sends,
    page,
    pageSize,
    totalSize: keepCounting ? matches.length : size(sendList),
  };
};

// fast equality change to see if update is warranted
export const isEquivalent = (list1, list2) => (
  every(propName => list1[propName] === list2[propName], ['#', 'h', '$'])
);
