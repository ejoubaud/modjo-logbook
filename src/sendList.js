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
import merge from 'lodash/fp/merge';
import filter from 'lodash/fp/filter';
import reduce from 'lodash/fp/reduce';
import _isEmpty from 'lodash/fp/isEmpty';

import colors from './colors';
import sendTypes from './send-types';
import { generateSendId } from './send';

// home-made obj-based Set with wide browser support
const toSet = compose(
  fromPairs,
  map(v => [v, true]),
);

const id = (v) => v;

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

const compressSend = ({ color, sectorId, type, createdAt }) => (
  { c: compressColor(color), s: sectorId, t: compressType(type), d: createdAt }
);
const uncompressSend = ({ c, s, t, d }, id) => (
  { id, color: uncompressColor(c), sectorId: s, type: uncompressType(t), createdAt: toDate(d) }
);

// set unused fields to null to avoid Firestore failure when
// trying to save an 'undefined' value, in case the undefined gets copied
export const empty = { '#': 0, l: {}, h: null, $: null };

export const isEmpty = ({ l }) => !l || _isEmpty(l);

export const add = (sendList, send) => {
  const id = send.id || generateSendId();
  const { h, l, $ } = sendList;
  const count = sendList['#'] || 0;
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

// Counts elem intersection by id, faster if arg 1 is shorter
const countSharedIds = (sendList1, sendList2) => (
  compose(
    filter(id => sendList2.l[id]),
    keys,
  )(sendList1.l).length
);

// accepts either a list of send with id ([send1, send2, ...])
// or without [{id: id1, send: send1}, ...]
// returns a diff, i.e. only the fields that would change in the sendList
export const addAllDiff = (sendList, sends) => {
  const diffBase = addAll(empty, sends);
  const readditions = countSharedIds(diffBase, sendList);
  return {
    ...diffBase,
    $: sendList.$ || diffBase.$,
    '#': (sendList['#'] || 0) + diffBase['#'] - readditions,
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

const makePageFilter = ({ abbrev, value, compressValue = id }) => {
  if (_isEmpty(value)) return null;
  const compressedValuesArray = map(compressValue, [].concat(value));
  const valuesSet = toSet(compressedValuesArray);
  return elem => valuesSet[elem[abbrev]];
};

const combinePageFilters = (definitions) => {
  const filters = compose(
    compact,
    map(makePageFilter),
  )(definitions);
  return elem => every(filter => filter(elem), filters);
};

export const size = sendList => sendList['#'];

export const getPage = (sendList, { page = 1, pageSize = 10, colors = null, sectorIds = null }) => {
  if (!(sendList && sendList.h)) return { sends: [], totalSize: 0, page, pageSize };
  const list = sendList.l;
  const sends = [];
  let nextId = sendList.h;
  const matchesfilters = combinePageFilters([
    { abbrev: 'c', value: colors, compressValue: compressColor },
    { abbrev: 's', value: sectorIds },
  ]);
  let count = 0;
  let skip = (page - 1) * pageSize;
  // if filters passed, we need to iterate over the whole thing to get total count after filtering
  const keepCounting = !(_isEmpty(colors) && _isEmpty(sectorIds));
  while (nextId && (keepCounting || sends.length < pageSize)) {
    const node = list[nextId];
    const compressedSend = node.e;
    if (matchesfilters(compressedSend)) {
      count += 1;
      if (skip > 0) {
        skip -= 1;
      } else if (sends.length < pageSize) {
        sends.push(uncompressSend(compressedSend, nextId));
      }
    }
    nextId = node.n;
  }
  return {
    sends,
    page,
    pageSize,
    totalSize: keepCounting ? count : sendList['#'],
  };
};

// checks for race-condition-induced inconsistencies,
// where the count doesn't match the number of records
// means 2 batches of sends were either:
// 1. added on the same cached counter, so there are orphan
//    sends in the linked list (not referenced in any next)
// 2. removed on the same cached counter, so the count should
//    by updated
// returns a diff, i.e. an object of just the fields that
// need to be added/updated/deep-merged to fix the list
export const fixDiff = (source) => {
  const cachedCount = source['#'];
  if (typeof cachedCount === 'undefined') return null;
  const actualCount = keys(source.l).length;
  if (cachedCount === actualCount) return null;
  if (cachedCount < actualCount) return { '#': actualCount };
  // if more records in the list than accounted for,
  // there must be orphans: we need to fix the "next"s chain
  const { l } = source;
  const referencedIds = compose(
    merge({ h: true, $: true }),
    toSet,
    map(({ n }) => n),
  )(l);
  const orphanSends = compose(
    map(id => ({ ...uncompressSend(source.l[id]), id })),
    filter(id => !referencedIds[id]),
    keys,
  )(l);
  return addAllDiff(source, orphanSends);
};

// fast equality change to see if update is warranted
export const isEquivalent = (list1, list2) => (
  every(propName => list1[propName] === list2[propName], ['#', 'h'])
);
