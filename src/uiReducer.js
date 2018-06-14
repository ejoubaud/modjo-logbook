import xor from 'lodash/fp/xor';
import union from 'lodash/fp/union';
import without from 'lodash/fp/without';

import * as actions from './actions';
import * as sendMap from './sendMap';
import * as sendList from './sendList';
import * as sendSummary from './sendSummary';
import { allIds as allSectorIds } from './sectors';

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

  [actions.TOGGLE_ALL_SECTORS]: state => ({
    ...state,
    selectedSectors: (state.selectedSectors.length > 0 ? [] : allSectorIds),
  }),

  [actions.SEND_BOULDERS]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.addAll(state.sendMap, payload.sends),
    sendList: sendList.addAll(state.sendList, payload.sends),
    sendSummary: sendSummary.addAll(state.sendSummary, payload.sends, payload.user),
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
    sendMap: sendMap.removeSectors(state.sendMap, payload.clearSends.map(s => s.sectorId)),
    sendList: sendList.addAll(state.sendList, payload.clearSends),
    selectedSectors: [],
  }),

  [actions.REMOVE_SEND]: (state, { payload }) => ({
    ...state,
    sendMap: sendMap.remove(state.sendMap, payload.send.color, payload.send.sectorId),
    sendList: sendList.remove(state.sendList, payload.send),
    sendSummary: sendSummary.remove(state.sendSummary, payload.send),
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

  [actions.SYNC_SEND_SUMMARY]: (state, { payload }) => ({
    ...state,
    sendSummary: payload.sendSummary,
  }),

  [actions.ROLLBACK]: (state, { payload }) => ({
    ...state,
    sendMap: payload.previousSendMap,
    sendList: payload.previousSendList || state.previousSendList,
    error: payload.error,
    isErrorHidden: false,
    selectedSectors: [],
  }),

  [actions.CHANGE_SEND_LIST_PAGE]: (state, { payload }) => {
    const page = payload.page || 1;
    return {
      ...state,
      sendListPage: (page >= 1 ? page : 1),
    };
  },

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

  [actions.TOGGLE_LOADING]: (state, { payload }) => {
    const loadingProcessIds = ((on, id, ids) => {
      if (on) return (id ? union([id], ids) : union(['@@global@@'], ids));
      // toggle-off with an empty ID turns off all ongoing loadings
      return (id ? without(ids, id) : []);
    })(payload.on, payload.processId, state.processIds);
    return {
      ...state,
      loadingProcessIds,
    };
  },
};

const defaultState = {
  selectedColor: null,
  selectedSectors: [],
  sendMap: sendMap.empty,
  sendList: sendList.empty,
  sendListPage: 1,
  sendSummary: sendSummary.empty,
  error: null,
  isErrorHidden: null,
  errorIgnoreList: [],
  errorIgnoreId: null,
  loadingProcessIds: [],
};

export default function uiReducer(state = defaultState, action) {
  const reducer = reducers[action.type];
  if (reducer) return reducer(state, action);
  return state;
}
