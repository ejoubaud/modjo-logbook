import { compose } from 'redux';

import * as ss from './sendSummary';

const baseDate = new Date();
const fromBase = diff => new Date(baseDate - diff);
const send1 = { id: 's3ndNumb3r1', color: 'blue', sectorId: 1, type: 'flash', createdAt: fromBase(20000) };
const send2 = { id: 's3ndNumb3r2', color: 'green', sectorId: 2, type: 'flash', createdAt: fromBase(3000) };
const send3 = { id: 's3ndNumb3r3', color: 'green', sectorId: 3, type: 'redpoint', createdAt: fromBase(2000) };
const send4 = { id: 's3ndNumb3r4', color: 'blue', sectorId: 2, type: 'redpoint', createdAt: fromBase(1000) };
const send5 = { id: 's3ndNumb3r5', color: 'yellow', sectorId: 1, type: 'redpoint', createdAt: baseDate };

const user1 = { uid: 'uZerNumb3r1', displayName: 'User One', photoURL: 'https://photo.com/u1' };
const user2 = { uid: 'uZerNumb3r2', displayName: 'User Two', photoURL: 'https://photo.com/u2' };

const summary = compose(
  s => ss.addAll(s, [send4, send5], user1),
  s => ss.add(s, send3, user2),
  s => ss.addAll(s, [send1, send2], user1),
)(ss.empty);

// compare everything but user user shortIds, which will
// differ between independently created sendSummaries
function assertSummaryEquivalence(received, expected) {
  expect(ss.isEquivalent(received, expected))
    .toBeTruthy;
  expect(Object.keys(received.shortIdsByUid))
    .toEqual(Object.keys(expected.shortIdsByUid));
  expect(Object.keys(received.users).length)
    .toEqual(Object.keys(expected.users).length);
}

describe('.addUserDiff', () => {
  describe("when adding a user that doesn't exist", () => {
    it('only returns the new user parts', () => {
      const user3 = { uid: 'uZerNumb3r3', displayName: 'User Three', photoURL: 'https://photo.com/u3' };
      const result = ss.addUserDiff(summary, user3);
      const shortId = ss.getShortId(result, user3.uid);
      expect(result).toEqual({
        users: { [shortId]: { n: user3.displayName, a: user3.photoURL } },
        shortIdsByUid: { [user3.uid]: shortId },
      });
    });
  });

  describe('when modifying a user that does exist', () => {
    it('reuses the shortId and only returns modified parts', () => {
      const shortId = ss.getShortId(summary, user2.uid);
      const newName = 'newName';
      const result = ss.addUserDiff(summary, { uid: user2.uid, displayName: newName });
      expect(result).toEqual({
        users: { [shortId]: { n: newName } },
        shortIdsByUid: { [user2.uid]: shortId },
      });
    });
  });
});

describe('.split', () => {
  describe('with a target length bigger or equal to list', () => {
    const targetLength = 5;

    it('returns the passed summary and an empty summary', () => {
      const [recent, archive] = ss.split(summary, targetLength);
      expect(recent).toEqual(summary);
      expect(archive).toEqual(ss.empty);
    });
  });

  describe('with a target length smaller than list', () => {
    const targetLength = 3;

    it('returns a summary with `target` sends and their users first, and the rest of oldest sends second', () => {
      const [recent, archive] = ss.split(summary, targetLength);
      const expectedRecent = compose(
        s => ss.addAll(s, [send4, send5], user1),
        s => ss.add(s, send3, user2),
      )(ss.empty);
      assertSummaryEquivalence(recent, expectedRecent);
      assertSummaryEquivalence(archive, ss.addAll(ss.empty, [send1, send2], user1));
    });
  });
});
