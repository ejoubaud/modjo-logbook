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
import compose from 'lodash/fp/compose';
import every from 'lodash/fp/every';
import keys from 'lodash/fp/keys';
import filter from 'lodash/fp/filter';
import reduce from 'lodash/fp/reduce';
import _isEmpty from 'lodash/fp/isEmpty';

import colors from './colors';
import sendTypes from './send-types';
import { generateSendId } from './send';

const compressColor = color => colors[color].abbrev;
const compressType = type => sendTypes[type].abbrev;

const compressSend = ({ color, sectorId, type }) => (
  { c: compressColor(color), s: sectorId, t: compressType(type) }
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

// fast equality change to see if update is warranted
export const isEquivalent = (list1, list2) => (
  every(propName => list1[propName] === list2[propName], ['#', 'h'])
);
