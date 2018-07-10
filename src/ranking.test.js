/* eslint-disable no-multi-spaces */
import shuffle from 'lodash/fp/shuffle';
import random from 'lodash/fp/random';
import uniqueId from 'lodash/fp/uniqueId';
import reduce from 'lodash/fp/reduce';
import flatMap from 'lodash/fp/flatMap';
import map from 'lodash/fp/map';

import { createRanking } from './ranking';
import * as ss from './sendSummary';
import { colorKeys } from './colors';
import { allIds as sectorIds } from './sectors';

const user1 = { uid: 'uZerNumb3r1', displayName: 'User One', photoURL: 'https://photo.com/u1' };
const user2 = { uid: 'uZerNumb3r2', displayName: 'User Two', photoURL: 'https://photo.com/u2' };

const now = new Date();

const randomSendType = () => ['redpoint', 'flash'][random(0, 1)];

const makeSend = (colorOrType, sectorId, createdAt = now) => (
  colorOrType === 'clear'
    ? { id: uniqueId(), type: 'clear', sectorId, createdAt }
    : { id: uniqueId(), type: randomSendType(), color: colorOrType, sectorId, createdAt }
);

const makeSummary = sendDefinitions => (
  reduce(
    (summary, [user, colorOrType, sectorId, date]) => (
      ss.add(summary, makeSend(colorOrType, sectorId, date), user)
    ),
    ss.empty,
    shuffle(sendDefinitions),
  )
);

describe('.fromSendSummary', () => {
  it('gives precedence to the highest color', () => {
    const summary = makeSummary([
      [user1, 'green', 1],
      [user1, 'green', 2],
      [user2, 'blue',  3],
    ]);

    const result = createRanking(summary);

    expect(result[0].displayName).toBe(user2.displayName);
    expect(result[1].displayName).toBe(user1.displayName);
  });

  it('contains a count of the sends in each color', () => {
    const summary = makeSummary([
      [user1, 'green', 1],
      [user1, 'green', 2],
      [user1, 'red', 3],
      [user2, 'blue',  3],
    ]);

    const result = createRanking(summary);

    expect(result[0].scores).toEqual({
      red: 1,
      green: 2,
    });
    expect(result[1].scores).toEqual({
      blue: 1,
    });
    expect(result[0].score);
  });

  it('ignores duplicates', () => {
    const summary = makeSummary([
      [user1, 'green', 1],
      [user1, 'green', 1],
      [user1, 'red', 3],
      [user2, 'red', 3],
    ]);

    const result = createRanking(summary);

    expect(result[0].scores).toEqual({
      red: 1, green: 1,
    });
    expect(result[1].scores).toEqual({
      red: 1,
    });
  });

  it('ignores clears', () => {
    const summary = makeSummary([
      [user1, 'red', 1],
      [user1, 'red', 2],
      [user1, 'clear', 1],
      [user2, 'clear', 3],
      [user2, 'green', 3],
    ]);

    const result = createRanking(summary);

    expect(result[0].scores).toEqual({
      red: 2,
    });
    expect(result[1].scores).toEqual({
      green: 1,
    });
  });

  it('filters out results older than 3 months by default', () => {
    const fourMonthsAgo = new Date().setMonth(now.getMonth() - 4);
    const summary = makeSummary([
      [user1, 'red', 1],
      [user1, 'red', 2, fourMonthsAgo],
    ]);

    const result = createRanking(summary);

    expect(result[0].scores).toEqual({
      red: 1,
    });
  });

  it("doesn't overflow on the highest possible score", () => {
    const allPossibleSends = flatMap(
      color => (
        map(sectorId => [user1, color, sectorId], sectorIds)
      ),
      colorKeys,
    );
    const summary = makeSummary(allPossibleSends);

    const result = createRanking(summary);

    expect(result[0].score).not.toBe(NaN);
  });
});
