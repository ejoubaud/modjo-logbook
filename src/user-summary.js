// Summaries store a lot of sends in a single Firestore doc to limit (billed) DB reads
// They use send lists under the hood
import get from 'lodash/fp/get';
import every from 'lodash/fp/every';

import * as sendList from './send-list';

const compressUser = ({ uid, displayName, photoURL }) => (
  { i: uid, n: displayName, a: photoURL }
);

export const empty = { user: null, sendList: sendList.empty };

export const isEmpty = summary => (
  !summary.user && sendList.isEmpty(summary.sendList)
);

export const add = (summary, user, send) => ({
  user: compressUser(user),
  sendList: sendList.add(summary.sendList, send),
});

export const addAllDiff = (summary, user, sends) => ({
  user: compressUser(user),
  sendList: sendList.addAllDiff(summary.sendList, sends),
});

export const applyDiff = (source, diff) => ({
  ...source,
  ...diff,
  sendList: sendList.applyAddDiff(source.sendList, diff.sendList),
});

export const isEquivalent = (summary1, summary2) => (
  every(propName => get(['user', propName], summary1) === get(['user', propName], summary2), ['i', 'n', 'a']) &&
  sendList.isEquivalent(summary1.sendList, summary2.sendList)
);
