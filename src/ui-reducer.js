import { types } from './actions';

const reducers = {
  [types.toggleColor]: (state, { payload }) => {
    const newColor = (state.selectedColor === payload.color ? null : payload.color);
    return { ...state, selectedColor: newColor };
  },
  [types.toggleSector]: (state, { payload }) => {
    const newSector = (state.selectedSector === payload.sectorId ? null : payload.sectorId);
    return { ...state, selectedSector: newSector };
  },
};

const defaultState = { selectedColor: null, selectedSector: null };

export default function uiReducer(state = defaultState, action) {
  const reducer = reducers[action.type];
  if (reducer) return reducer(state, action);
  return state;
}
