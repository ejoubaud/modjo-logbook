import { types } from './actions';

const reducers = {
  [types.selectColor]: (state, { payload }) => (
    { ...state, selectedColor: payload.color }
  ),
  [types.unselectColor]: state => (
    { ...state, selectedColor: null }
  ),
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
