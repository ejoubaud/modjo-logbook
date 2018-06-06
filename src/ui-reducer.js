import xor from 'lodash/fp/xor';

import { types } from './actions';
import * as sendMap from './send-map';
import * as sendList from './send-list';

const reducers = {
  [types.toggleColor]: (state, { payload }) => {
    const newColor = (state.selectedColor === payload.color ? null : payload.color);
    return {
      ...state,
      selectedColor: newColor,
    };
  },

  [types.toggleSector]: (state, { payload }) => ({
    ...state,
    selectedSectors: xor(state.selectedSectors, [payload.sectorId]),
  }),

  [types.sendBoulders]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.addAll(state.sendMap, payload.sends),
    sendList: sendList.addAll(state.sendList, payload.sends),
    selectedSectors: [],
  }),

  // not used anymore (we clear sectors now, not just boulders)
  [types.clearBoulders]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.removeSectorsInColor(state.sendMap, payload.color, payload.sectors),
    selectedSectors: [],
  }),

  [types.clearSectors]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.removeSectors(state.sendMap, payload.sectors),
    selectedSectors: [],
  }),

  [types.syncSendMap]: (state, { payload }) => ({
    ...state,
    sendMap: payload.sendMap,
    selectedSectors: [],
  }),

  [types.syncSendList]: (state, { payload }) => ({
    ...state,
    sendList: payload.sendList,
  }),

  [types.rollback]: (state, { payload }) => ({
    ...state,
    sendMap: payload.previousSendMap,
    sendList: payload.previousSendList || state.previousSendList,
    error: payload.error,
    isErrorHidden: false,
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

  [types.toggleLoading]: (state, { payload }) => ({
    ...state,
    isLoading: payload.on,
  }),
};

const defaultState = {
  selectedColor: null,
  selectedSectors: [],
  sendMap: sendMap.empty,
  sendList: sendList.empty,
  error: null,
  isErrorHidden: null,
  errorIgnoreList: [],
  errorIgnoreId: null,
  isLoading: false,
};

export default function uiReducer(state = defaultState, action) {
  const reducer = reducers[action.type];
  if (reducer) return reducer(state, action);
  return state;
}
