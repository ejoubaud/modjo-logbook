import compose from 'lodash/fp/compose';
import reduce from 'lodash/fp/reduce';
import filter from 'lodash/fp/filter';
import values from 'lodash/fp/values';
import orderBy from 'lodash/fp/orderBy';
import fromPairs from 'lodash/fp/fromPairs';
import not from 'lodash/fp/negate';

import { toList as summaryToList } from './sendSummary';
import { isClear } from './send';
import { colorKeys } from './colors';
import { count as sectorsCount } from './sectors';

const scoreByColor = fromPairs(
  colorKeys.map((color, idx) => (
    [color, sectorsCount ** idx]
  )),
);

const newUserEntry = user => (
  { ...user, counted: {}, scores: [], score: 0 }
);

const countSend = (userMap, send) => {
  const { color, sectorId, user } = send;
  const entry = userMap[user.uid] || newUserEntry(user);
  const countedKey = `${color}-${sectorId}`;
  if (entry.counted[countedKey]) return { ...userMap, [user.uid]: entry };
  const colorScore = (entry.scores[color] || 0) + 1;
  return {
    ...userMap,
    [user.uid]: {
      ...entry,
      counted: { ...entry.counted, [countedKey]: true },
      scores: { ...entry.scores, [color]: colorScore },
      score: entry.score + scoreByColor[color],
    },
  };
};

const threeMonthsAgo = () => {
  const d = new Date();
  return new Date(d.setMonth(d.getMonth() - 3));
};

export const createRanking = (summary, fromDate = threeMonthsAgo()) => {
  const actualSends = compose(
    filter(not(isClear)),
    filter(s => (fromDate ? s.createdAt >= fromDate : true)),
    summaryToList,
  )(summary);

  const userMap = reduce(countSend, {}, actualSends);

  return compose(
    orderBy('score', 'desc'),
    values,
  )(userMap);
};

const size = ranking => ranking.length;

export const getPage = (ranking, { page = 1, pageSize = 10 }) => {
  const offset = (page - 1) * pageSize;
  const users = ranking.slice(offset, offset + pageSize);
  return {
    users,
    page,
    pageSize,
    totalSize: size(ranking),
  };
};
