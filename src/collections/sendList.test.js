import * as sl from './sendList';

const baseDate = new Date();
const fromBase = diff => new Date(baseDate - diff);
const send1 = { id: 's3ndNumb3r1', color: 'blue', sectorId: 1, type: 'flash', createdAt: fromBase(20000) };
const send2 = { id: 's3ndNumb3r2', color: 'blue', sectorId: 2, type: 'redpoint', createdAt: fromBase(1000) };
const send3 = { id: 's3ndNumb3r3', color: 'green', sectorId: 2, type: 'flash', createdAt: fromBase(1000) };
const send4 = { id: 's3ndNumb3r4', color: 'green', sectorId: 3, type: 'redpoint', createdAt: baseDate };
const sendList = sl.addAll(sl.empty, [send1, send2, send3, send4]);

describe('.split', () => {
  describe('with a target length bigger or equal to list', () => {
    const targetLength = 4;

    it('returns the passed sendList and an empty sendList', () => {
      const [recentSends, oldSends] = sl.split(sendList, targetLength);
      expect(recentSends).toEqual(sendList);
      expect(oldSends).toEqual(sl.empty);
    });
  });

  describe('with a target length smaller than list', () => {
    const targetLength = 2;

    it('returns a sendList with `target` sends first, and the rest of oldest sends second', () => {
      const [recentSends, oldSends] = sl.split(sendList, targetLength);
      expect(recentSends).toEqual(sl.addAll(sl.empty, [send3, send4]));
      expect(oldSends).toEqual(sl.addAll(sl.empty, [send1, send2]));
    });
  });
});
