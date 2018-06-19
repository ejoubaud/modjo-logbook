// Stores the list of all the more recent sends by all users
// using as few bytes as possible in a single Firestore document
// Uses a sendList to track the sends, and keeps a list of users,
// with a short ID to save some bytes on the long default UUID of Firestore auth
import reduce from 'lodash/fp/reduce';
import unset from 'lodash/fp/unset';
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

const compressUser = ({ displayName, photoURL }) => ({
  n: displayName,
  a: photoURL,
});

const uncompressUser = ({ n, a }) => ({
  displayName: n,
  photoURL: a,
});

const getShortId = ({ shortIdsByUid }, uid) => shortIdsByUid[uid];

const addUserDiff = (summary, user) => {
  const existingShortId = getShortId(summary, user.uid);
  const compressedUser = compressUser(user);
  if (existingShortId) return { users: { [existingShortId]: compressedUser } };
  const shortId = generateShortUserId(summary);
  return {
    users: { [shortId]: compressedUser },
    shortIdsByUid: { [user.uid]: shortId },
  };
};

const addUser = (summary, user) => {
  const { users, shortIdsByUid } = summary;
  const diff = addUserDiff(summary, user);
  return {
    ...summary,
    users: Object.assign({}, users, diff.users),
    shortIdsByUid: Object.assign({}, shortIdsByUid, diff.shortIdsByUid),
  };
};

const setSendShortId = shortId => send => ({ ...send, userId: shortId });

// adds a send assuming the user was added to users and has a short ID in shortIdsByUid
const addSend = (summary, send, user) => {
  const shortId = getShortId(summary, user.uid);
  const sendWithShortUserId = setSendShortId(shortId)(send);
  return {
    ...summary,
    sendList: sendListUtils.add(summary.sendList, sendWithShortUserId),
  };
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
  const shortId = getShortId(summary, send.userId);
  const shouldRemoveUser = !!sendListUtils.hasOneByUserId(newSendList, shortId);
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
  const shouldRemoveUser = !sendListUtils.hasSeveralByUserId(sendList, shortId);
  const baseDiff = { sendList: sendListDiff };
  if (!shouldRemoveUser) return baseDiff;
  return {
    ...baseDiff,
    users: { [shortId]: deletionMarker },
    shortIdsByUid: { [userId]: deletionMarker },
  };
};

export const size = ({ sendList }) => sendListUtils.size(sendList);

const getUser = (summary, send) => uncompressUser(summary.users[send.userId]);
const addUserToSend = summary => send => ({ ...send, user: getUser(summary, send) });

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
