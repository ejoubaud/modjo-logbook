import xor from 'lodash/fp/xor';

import * as actions from './actions';
import * as sendMap from './send-map';
import * as sendList from './send-list';

const reducers = {
  [actions.TOGGLE_COLOR]: (state, { payload }) => {
    const newColor = (state.selectedColor === payload.color ? null : payload.color);
    return {
      ...state,
      selectedColor: newColor,
    };
  },

  [actions.TOGGLE_SECTOR]: (state, { payload }) => ({
    ...state,
    selectedSectors: xor(state.selectedSectors, [payload.sectorId]),
  }),

  [actions.SEND_BOULDERS]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.addAll(state.sendMap, payload.sends),
    sendList: sendList.addAll(state.sendList, payload.sends),
    selectedSectors: [],
  }),

  // not used anymore (we clear sectors now, not just boulders)
  [actions.CLEAR_BOULDERS]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.removeSectorsInColor(state.sendMap, payload.color, payload.sectors),
    selectedSectors: [],
  }),

  [actions.CLEAR_SECTORS]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.removeSectors(state.sendMap, payload.sectors),
    selectedSectors: [],
  }),

  [actions.SYNC_SEND_MAP]: (state, { payload }) => ({
    ...state,
    sendMap: payload.sendMap,
    selectedSectors: [],
  }),

  [actions.SYNC_SEND_LIST]: (state, { payload }) => ({
    ...state,
    sendList: payload.sendList,
  }),

  [actions.ROLLBACK]: (state, { payload }) => ({
    ...state,
    sendMap: payload.previousSendMap,
    sendList: payload.previousSendList || state.previousSendList,
    error: payload.error,
    isErrorHidden: false,
    selectedSectors: [],
  }),

  [actions.SHOW_ERROR]: (state, { payload }) => {
    if (state.errorIgnoreList.indexOf(payload.ignoreId) >= 0) return state;
    return {
      ...state,
      error: payload.error,
      isErrorHidden: false,
      errorIgnoreId: payload.ignoreId,
    };
  },

  [actions.HIDE_ERROR]: (state, { payload }) => ({
    ...state,
    isErrorHidden: true,
    errorIgnoreList: state.errorIgnoreList.concat(payload.ignoreId || []),
    errorIgnoreId: null,
  }),

  [actions.TOGGLE_LOADING]: (state, { payload }) => ({
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
