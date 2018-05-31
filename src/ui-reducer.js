import xor from 'lodash/fp/xor';

import { types } from './actions';
import * as sendMap from './send-map';

const reducers = {
  [types.toggleColor]: (state, { payload }) => {
    const newColor = (state.selectedColor === payload.color ? null : payload.color);
    return {
      ...state,
      selectedColor: newColor,
      // TODO: Restoring bg selections can lead to inconsistencies on the
      // "homogeneous sent/unset select group" invariant if the list of sent boulders
      // has been updated in-between, e.g. from the server/db
      selectedSectors: state.backgroundSelections[newColor] || [],
      backgroundSelections: {
        ...state.backgroundSelections,
        [state.selectedColor]: state.selectedSectors,
      },
    };
  },

  [types.toggleSector]: (state, { payload }) => ({
    ...state,
    selectedSectors: xor(state.selectedSectors, [payload.sectorId]),
  }),

  [types.sendBoulders]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.addAll(state.sendMap, payload.sends),
    selectedSectors: [],
  }),

  [types.clearBoulders]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.removeAll(state.sendMap, payload.color, payload.sectors),
    selectedSectors: [],
  }),

  [types.syncSendMap]: (state, { payload }) => ({
    ...state,
    sendMap: payload.sendMap,
    selectedSectors: [],
  }),

  [types.showError]: (state, { payload }) => {
    if (state.errorIgnoreList.indexOf(payload.ignoreId) >= 0) return state;
    return {
      ...state,
      error: payload.error,
      isErrorHidden: false,
      errorIgnoreId: payload.ignoreId,
    };
  },

  [types.hideError]: (state, { payload }) => ({
    ...state,
    isErrorHidden: true,
    errorIgnoreList: state.errorIgnoreList.concat(payload.ignoreId || []),
    errorIgnoreId: null,
  }),
};

const defaultState = {
  selectedColor: null,
  selectedSectors: [],
  sendMap: sendMap.empty,
  backgroundSelections: {},
  error: null,
  isErrorHidden: null,
  errorIgnoreList: [],
  errorIgnoreId: null,
};

export default function uiReducer(state = defaultState, action) {
  const reducer = reducers[action.type];
  if (reducer) return reducer(state, action);
  return state;
}
