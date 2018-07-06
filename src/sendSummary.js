// Stores the list of all the more recent sends by all users
// using as few bytes as possible in a single Firestore document
// Uses a sendList to track the sends, and keeps a list of users,
// with a short ID to save some bytes on the long default UUID of Firestore auth
import reduce from 'lodash/fp/reduce';
import unset from 'lodash/fp/unset';
import compose from 'lodash/fp/compose';
import map from 'lodash/fp/map';
import reverse from 'lodash/fp/reverse';
import fromPairs from 'lodash/fp/fromPairs';
import toPairs from 'lodash/fp/toPairs';
import _isEmpty from 'lodash/fp/isEmpty';
import nanoid from 'nanoid';

import * as sendListUtils from './sendList';

export const empty = {
  users: {},
  shortIdsByUid: {},
  sendList: sendListUtils.empty,
};

export const isEmpty = ({ users, sendList }) => (
  !users || _isEmpty(users) || !sendList || sendListUtils.isEmpty(sendList)
);

export const isEquivalent = (summary1, summary2) => (
  // assumes the sendList is a good proxy for the whole list
  // added bonus: ignores the short id discrepancy between local and firestore state
  // on a user's first submit (as the db's generates its own short id after the local
  // submitSend event has already generated one)
  sendListUtils.isEquivalent(summary1.sendList, summary2.sendList)
);

// ints would be stringified in hash keys so we'll use fewer bytes with string IDs
const generateShortUserId = ({ users }) => {
  const shortId = nanoid(3);
  // generate new one if taken already, lets us use fewer chars without fear of collision
  return users[shortId] ? generateShortUserId({ users }) : shortId;
};

const compressUser = ({ uid, displayName, photoURL }) => ({
  i: uid,
  n: displayName,
  ...(photoURL ? { a: photoURL } : {}),
});

const uncompressUser = ({ n, a, i }) => ({
  uid: i,
  displayName: n,
  photoURL: a,
});

export const getShortId = ({ shortIdsByUid }, uid) => shortIdsByUid[uid];

// low-level user add/replace method, all the id generation must be done upstream
const addCompressedUser = (summary, compressedUser, shortId) => ({
  ...summary,
  users: {
    ...summary.users,
    [shortId]: compressedUser,
  },
  shortIdsByUid: {
    ...summary.shortIdsByUid,
    [compressedUser.i]: shortId,
  },
});

const addUser = (sourceSummary, user, opts = { to: sourceSummary }) => (
  addCompressedUser(
    opts.to,
    compressUser(user),
    getShortId(sourceSummary, user.uid) || generateShortUserId(sourceSummary),
  )
);

export const addUserDiff = (summary, user) => (
  addUser(summary, user, { to: {} })
);

const setSendShortId = shortId => send => ({ ...send, shortUserId: shortId });

// low-level add method, assumes correct shortUserId was set on send
const addSendRaw = (summary, send) => ({
  ...summary,
  sendList: sendListUtils.add(summary.sendList, send),
});

// adds a send assuming the user was added to users and has a short ID in shortIdsByUid
const addSend = (summary, send, user) => {
  const shortId = getShortId(summary, user.uid);
  const sendWithShortUserId = setSendShortId(shortId)(send);
  return addSendRaw(summary, sendWithShortUserId);
};

export const add = (summary, send, user) => {
  const summaryWithUser = addUser(summary, user);
  return addSend(summaryWithUser, send, user);
};

export const addAll = (summary, sends, user) => {
  const summaryWithUser = addUser(summary, user);
  return reduce((summary, send) => addSend(summary, send, user), summaryWithUser, sends);
};

// returns an object to add just the relevant to Firestore doc, with deep merge
export const addAllDiff = (summary, sends, user) => {
  const userDiff = addUserDiff(summary, user);
  const shortId = getShortId(summary, user.uid) || getShortId(userDiff, user.uid);
  const sendsWithShortUserId = sends.map(setSendShortId(shortId));
  const sendListDiff = sendListUtils.addAllDiff(summary.sendList, sendsWithShortUserId);
  return {
    ...userDiff,
    sendList: sendListDiff,
  };
};

const removeUser = (summary, uid) => {
  const { users, shortIdsByUid } = summary;
  const shortId = getShortId(summary, uid);
  const newUsers = unset(shortId, users);
  const newShortIdsByUid = unset(uid, shortIdsByUid);
  return {
    ...summary,
    users: newUsers,
    shortIdsByUid: newShortIdsByUid,
  };
};

export const remove = (summary, send) => {
  const newSendList = sendListUtils.remove(summary.sendList, send);
  const shortId = getShortId(summary, send.shortUserId);
  const shouldRemoveUser = !!sendListUtils.hasOneByShortUserId(newSendList, shortId);
  const baseSummary = shouldRemoveUser ? removeUser(summary) : summary;
  return {
    ...baseSummary,
    sendList: newSendList,
  };
};

// Returns an object to remove just the relevant fields from Firestore doc
export const removeDiff = (summary, send, deletionMarker) => {
  const { sendList } = summary;
  const { userId } = send;
  const sendListDiff = sendListUtils.removeDiff(sendList, send, deletionMarker);
  const shortId = getShortId(summary, userId);
  const shouldRemoveUser = !sendListUtils.hasSeveralByShortUserId(sendList, shortId);
  const baseDiff = { sendList: sendListDiff };
  if (!shouldRemoveUser) return baseDiff;
  return {
    ...baseDiff,
    users: { [shortId]: deletionMarker },
    shortIdsByUid: { [userId]: deletionMarker },
  };
};

export const size = ({ sendList }) => sendListUtils.size(sendList);

const getUncompressedUserByShortId = (summary, shortUserId) => summary.users[shortUserId];
const getUserByShortId = (summary, shortUserId) => (
  uncompressUser(
    getUncompressedUserByShortId(summary, shortUserId),
  )
);
const addUserToSend = summary => send => ({
  ...send,
  user: getUserByShortId(summary, send.shortUserId),
});
const getUserByUid = (summary, uid) => {
  const shortId = getShortId(summary, uid);
  return shortId && getUserByShortId(summary, shortId);
};

export const hasUser = (summary, uid) => !!getUserByUid(summary, uid);

export const hasSameDisplayName = (summary1, summary2, uid) => {
  const user1 = getUserByUid(summary1, uid);
  const user2 = getUserByUid(summary2, uid);
  return user1 && user2 && user1.displayName === user2.displayName;
};

export const getPage = (summary, options = {}) => {
  const { sendList } = summary;
  const sendListPage = sendListUtils.getPage(sendList, options);
  const { sends } = sendListPage;
  const sendsWithUser = sends.map(addUserToSend(summary));
  return {
    ...sendListPage,
    sends: sendsWithUser,
  };
};

const uidsByShortId = ({ shortIdsByUid }) => (
  compose(
    fromPairs,
    map(([uid, shortId]) => [shortId, uid]),
    toPairs,
  )(shortIdsByUid)
);

const copySend = (destSummary, send) => (
  addSendRaw(destSummary, send)
);

const copySendUser = (sourceSummary, uid, destSummary, send) => (
  addCompressedUser(
    destSummary,
    getUncompressedUserByShortId(sourceSummary, send.shortUserId),
    send.shortUserId,
  )
);

const copySendWithUser = (sourceSummary, uidsByShortId) => (destSummary, send) => {
  const summaryWithUser = copySendUser(
    sourceSummary,
    uidsByShortId[send.shortUserId],
    destSummary,
    send,
  );
  return copySend(summaryWithUser, send);
};

const extractSendsFromSummary = sourceSummary => (sendList) => {
  const sourceUidsByShortId = uidsByShortId(sourceSummary);
  const sends = compose(
    reverse,
    sendListUtils.toList,
  )(sendList);
  return reduce(
    copySendWithUser(sourceSummary, sourceUidsByShortId),
    empty,
    sends,
  );
};

export const split = (summary, targetLength) => (
  sendListUtils.split(summary.sendList, targetLength)
    .map(extractSendsFromSummary(summary))
);
