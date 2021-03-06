import xor from 'lodash/fp/xor';
import union from 'lodash/fp/union';
import without from 'lodash/fp/without';

import * as actions from './actions';
import * as sendList from './collections/sendList';
import * as sendSummary from './collections/sendSummary';

const reducers = {
  [actions.TOGGLE_COLOR]: (state, { payload }) => {
    const newColor = (state.selectedColor === payload.color ? null : payload.color);
    return {
      ...state,
      selectedColor: newColor,
      funRating: null,
      difficultyRating: null,
    };
  },

  [actions.TOGGLE_SECTOR]: (state, { payload }) => {
    const { sectorId } = payload;
    const { selectedSectors, isSectorMultiSelectMode } = state;
    const newSelectedSectors = (() => {
      if (isSectorMultiSelectMode) return xor(selectedSectors, [sectorId]);
      if (selectedSectors.length === 1 && selectedSectors[0] === sectorId) return [];
      return [sectorId];
    })();
    return {
      ...state,
      selectedSectors: newSelectedSectors,
      funRating: null,
      difficultyRating: null,
    };
  },

  [actions.TOGGLE_FUN_RATING]: (state, { payload }) => ({
    ...state,
    funRating: (state.funRating === payload.value ? null : payload.value),
  }),

  [actions.TOGGLE_DIFFICULTY_RATING]: (state, { payload }) => ({
    ...state,
    difficultyRating: (state.difficultyRating === payload.value ? null : payload.value),
  }),

  [actions.TOGGLE_TAB]: (state, { payload }) => ({
    ...state,
    selectedTab: payload.tabId,
    sendListPage: 1,
    sendSummaryPage: 1,
  }),

  [actions.TOGGLE_SECTOR_MULTI_SELECT_MODE]: state => ({
    ...state,
    isSectorMultiSelectMode: !state.isSectorMultiSelectMode,
    selectedSectors: (state.selectedSectors.length > 1 ? [] : state.selectedSectors),
  }),

  [actions.SEND_BOULDERS]: (state, { payload }) => ({
    ...state,
    sendList: sendList.addAll(state.sendList, payload.sends),
    sendSummary: sendSummary.addAll(state.sendSummary, payload.sends, payload.user),
    selectedSectors: [],
  }),

  // not used anymore (we clear sectors now, not just boulders)
  [actions.CLEAR_BOULDERS]: state => ({
    ...state,
    selectedSectors: [],
  }),

  [actions.CLEAR_SECTORS]: (state, { payload }) => ({
    ...state,
    sendList: sendList.addAll(state.sendList, payload.clearSends),
    selectedSectors: [],
  }),

  [actions.REMOVE_SEND]: (state, { payload }) => ({
    ...state,
    sendList: sendList.remove(state.sendList, payload.send),
    sendSummary: sendSummary.remove(state.sendSummary, payload.send),
  }),

  [actions.SYNC_SEND_LIST]: (state, { payload }) => ({
    ...state,
    sendList: payload.sendList,
  }),

  [actions.SYNC_SEND_SUMMARY]: (state, { payload }) => ({
    ...state,
    sendSummary: payload.sendSummary,
  }),

  [actions.INIT_SPY_MODE]: (state, { payload }) => ({
    ...state,
    spyModeTarget: payload.user,
    sendList: sendList.empty,
    ownSendList: state.ownSendList || state.sendList,
    funRating: null,
    difficultyRating: null,
  }),

  [actions.EXIT_SPY_MODE]: state => ({
    ...state,
    spyModeTarget: null,
    sendList: state.ownSendList,
    selectedTab: (state.selectedTab === 1 ? 0 : state.selectedTab),
    ownSendList: null,
  }),

  [actions.ROLLBACK]: (state, { payload }) => ({
    ...state,
    sendList: payload.previousSendList || state.previousSendList,
    error: payload.error,
    isErrorHidden: false,
    selectedSectors: [],
    funRating: null,
    difficultyRating: null,
  }),

  [actions.CHANGE_SEND_LIST_PAGE]: (state, { payload }) => {
    const page = payload.page || 1;
    return {
      ...state,
      sendListPage: (page >= 1 ? page : 1),
    };
  },

  [actions.CHANGE_SEND_SUMMARY_PAGE]: (state, { payload }) => {
    const page = payload.page || 1;
    return {
      ...state,
      sendSummaryPage: (page >= 1 ? page : 1),
    };
  },

  [actions.CHANGE_RANKING_PAGE]: (state, { payload }) => {
    const page = payload.page || 1;
    return {
      ...state,
      rankingPage: (page >= 1 ? page : 1),
    };
  },

  [actions.TOGGLE_TABLE_FILTER_SYNC]: (state, { payload }) => ({
    ...state,
    isTableFilterSynced: payload.on,
    sendListPage: 1,
    sendSummaryPage: 1,
  }),

  [actions.SHOW_ERROR]: (state, { payload }) => {
    if (state.errorIgnoreList.indexOf(payload.ignoreId) >= 0) return state;
    return {
      ...state,
      error: payload.error,
      isErrorHidden: false,
      errorIgnoreId: payload.ignoreId,
      errorDisplayDuration: payload.displayDuration,
    };
  },

  [actions.HIDE_ERROR]: (state, { payload }) => ({
    ...state,
    isErrorHidden: true,
    errorIgnoreList: state.errorIgnoreList.concat(payload.ignoreId || []),
    errorIgnoreId: null,
    errorDisplayDuration: 6000,
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

  [actions.TOGGLE_AUTH_PROVIDER_MERGE]: (state, { payload }) => ({
    ...state,
    providersForMerge: payload,
  }),
};

const defaultState = {
  selectedColor: null,
  selectedSectors: [],
  selectedTab: 0,
  funRating: null,
  difficultyRating: null,
  isSectorMultiSelectMode: false,
  sendList: sendList.empty,
  sendListPage: 1,
  sendSummary: sendSummary.empty,
  sendSummaryPage: 1,
  rankingPage: 1,
  isTableFilterSynced: false,
  error: null,
  isErrorHidden: null,
  errorIgnoreList: [],
  errorIgnoreId: null,
  errorDisplayDuration: 6000,
  loadingProcessIds: [],
  spyModeTarget: null,
  ownSendList: null,
  providersForMerge: null,
};

export default function uiReducer(state = defaultState, action) {
  const reducer = reducers[action.type];
  if (reducer) return reducer(state, action);
  return state;
}
