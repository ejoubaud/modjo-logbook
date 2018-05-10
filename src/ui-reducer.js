import setWith from 'lodash/fp/setWith';
import unset from 'lodash/fp/unset';
import updateWith from 'lodash/fp/updateWith';
import compose from 'lodash/fp/compose';

import { types } from './actions';

const set = setWith(Object); // ensure works with number keys
const update = updateWith(Object); // ensure works with number keys

const reducers = {
  [types.toggleColor]: (state, { payload }) => {
    const newColor = (state.selectedColor === payload.color ? null : payload.color);
    return { ...state, selectedColor: newColor };
  },
  [types.toggleSector]: (state, { payload }) => {
    const newSector = (state.selectedSector === payload.sectorId ? null : payload.sectorId);
    return { ...state, selectedSector: newSector };
  },
  [types.sendBoulder]: (state, { payload }) => {
    const { color, sectorId } = payload;
    return compose(
      set(['myLastSends', color, sectorId], payload),
      update(['mySends', color, sectorId], previousSends => [payload].concat(previousSends || [])),
      unset('selectedSector'),
    )(state);
  },
};

const defaultState = { selectedColor: null, selectedSector: null, myLastSends: {}, mySends: {} };

export default function uiReducer(state = defaultState, action) {
  const reducer = reducers[action.type];
  if (reducer) return reducer(state, action);
  return state;
}
