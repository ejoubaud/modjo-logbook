export const TOGGLE_COLOR = 'TOGGLE_COLOR';
export const TOGGLE_SECTOR = 'TOGGLE_SECTOR';
export const TOGGLE_FUN_RATING = 'TOGGLE_FUN_RATING';
export const TOGGLE_DIFFICULTY_RATING = 'TOGGLE_DIFFICULTY_RATING';
export const TOGGLE_TAB = 'TOGGLE_TAB';
export const TOGGLE_SECTOR_MULTI_SELECT_MODE = 'TOGGLE_SECTOR_MULTI_SELECT_MODE';
export const SEND_BOULDERS = 'SEND_BOULDERS';
export const CLEAR_BOULDERS = 'CLEAR_BOULDERS'; // not used anymore
export const CLEAR_SECTORS = 'CLEAR_SECTORS';
export const REMOVE_SEND = 'REMOVE_SEND';
export const SYNC_SEND_LIST = 'SYNC_SEND_LIST';
export const SYNC_SEND_SUMMARY = 'SYNC_SEND_SUMMARY';
export const INIT_SPY_MODE = 'INIT_SPY_MODE';
export const EXIT_SPY_MODE = 'EXIT_SPY_MODE';
export const ROLLBACK = 'ROLLBACK';
export const CHANGE_SEND_LIST_PAGE = 'CHANGE_SEND_LIST_PAGE';
export const CHANGE_SEND_SUMMARY_PAGE = 'CHANGE_SEND_SUMMARY_PAGE';
export const CHANGE_RANKING_PAGE = 'CHANGE_RANKING_PAGE';
export const TOGGLE_TABLE_FILTER_SYNC = 'TOGGLE_TABLE_FILTER_SYNC';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const TOGGLE_LOADING = 'TOGGLE_LOADING';
export const TOGGLE_AUTH_PROVIDER_MERGE = 'TOGGLE_AUTH_PROVIDER_MERGE';

// saga actions
export const SUBMIT_SENDS = 'SUBMIT_SENDS';
export const SUBMIT_SEND_DELETION = 'SUBMIT_SEND_DELETION';
export const SUBMIT_CLEARS = 'SUBMIT_CLEARS';
export const SUBMIT_DISPLAY_NAME_UPDATE = 'SUBMIT_DISPLAY_NAME_UPDATE';
export const SUBMIT_SEND_SUMMARY_USER_UPDATE = 'SUBMIT_SEND_SUMMARY_USER_UPDATE';
export const SUBMIT_SEND_LIST_TRIM = 'SUBMIT_SEND_LIST_TRIM';
export const SUBMIT_SEND_SUMMARY_TRIM = 'SUBMIT_SEND_SUMMARY_TRIM';
export const START_SEND_LIST_SYNC = 'START_SEND_LIST_SYNC';
export const STOP_SEND_LIST_SYNC = 'STOP_SEND_LIST_SYNC';
export const START_SEND_SUMMARY_SYNC = 'START_SEND_SUMMARY_SYNC';
export const STOP_SEND_SUMMARY_SYNC = 'STOP_SEND_SUMMARY_SYNC';
export const START_SPY_MODE = 'START_SPY_MODE';
export const STOP_SPY_MODE = 'STOP_SPY_MODE';
export const DOWNLOAD_SEND_LIST_AS_CSV = 'DOWNLOAD_SEND_LIST_AS_CSV';

export const toggleColor = color => ({
  type: TOGGLE_COLOR,
  payload: { color },
});

export const toggleSector = sectorId => ({
  type: TOGGLE_SECTOR,
  payload: { sectorId },
});

export const toggleFunRating = value => ({
  type: TOGGLE_FUN_RATING,
  payload: { value },
});

export const toggleDifficultyRating = value => ({
  type: TOGGLE_DIFFICULTY_RATING,
  payload: { value },
});

export const toggleTab = tabId => ({
  type: TOGGLE_TAB,
  payload: { tabId },
});

export const toggleSectorMultiSelectMode = () => ({
  type: TOGGLE_SECTOR_MULTI_SELECT_MODE,
});

export const sendBoulders = (sends, user) => ({
  type: SEND_BOULDERS,
  payload: { sends, user },
});

// not used anymore (we clear sectors now, not just boulders)
export const clearBoulders = (color, sectors) => ({
  type: CLEAR_BOULDERS,
  payload: {
    color,
    sectors,
  },
});

export const clearSectors = clearSends => ({
  type: CLEAR_SECTORS,
  payload: { clearSends },
});

export const removeSend = send => ({
  type: REMOVE_SEND,
  payload: { send },
});

export const syncSendList = sendList => ({
  type: SYNC_SEND_LIST,
  payload: { sendList },
});

export const syncSendSummary = sendSummary => ({
  type: SYNC_SEND_SUMMARY,
  payload: { sendSummary },
});

export const initSpyMode = user => ({
  type: INIT_SPY_MODE,
  payload: { user },
});

export const exitSpyMode = () => ({
  type: EXIT_SPY_MODE,
});

export const rollback = ({ sendList, error }) => ({
  type: ROLLBACK,
  payload: { previousSendList: sendList, error },
});

export const changeSendListPage = page => ({
  type: CHANGE_SEND_LIST_PAGE,
  payload: { page },
});

export const changeSendSummaryPage = page => ({
  type: CHANGE_SEND_SUMMARY_PAGE,
  payload: { page },
});

export const changeRankingPage = page => ({
  type: CHANGE_RANKING_PAGE,
  payload: { page },
});

export const toggleTableFilterSync = on => ({
  type: TOGGLE_TABLE_FILTER_SYNC,
  payload: { on },
});

// ignoreId is optional
export const showError = (error, options) => ({
  type: SHOW_ERROR,
  payload: { error, ...options },
});

// ignoreId is optional, if passed this error won't be shown again
export const hideError = ignoreId => ({
  type: HIDE_ERROR,
  payload: { ignoreId },
});

// processId is optional, if passed lets you identify a single process
// to turn off loading for, so a concurrent loading finishing before
// doesn't remove the loading indicator for an unfinished other
export const toggleLoading = (on, processId) => ({
  type: TOGGLE_LOADING,
  payload: {
    on,
    processId,
  },
});

export const toggleAuthProviderMerge = providerIds => ({
  type: TOGGLE_AUTH_PROVIDER_MERGE,
  payload: providerIds,
});

// === SAGA ACTIONS ====

export const submitSends = type => ({
  type: SUBMIT_SENDS,
  payload: { type },
});

export const submitClears = () => ({
  type: SUBMIT_CLEARS,
});

export const submitSendDeletion = send => ({
  type: SUBMIT_SEND_DELETION,
  payload: { send },
});

export const submitDisplayNameUpdate = displayName => ({
  type: SUBMIT_DISPLAY_NAME_UPDATE,
  payload: { displayName },
});

export const submitSendSummaryUserUpdate = () => ({
  type: SUBMIT_SEND_SUMMARY_USER_UPDATE,
});

export const submitSendListTrim = () => ({
  type: SUBMIT_SEND_LIST_TRIM,
});

export const submitSendSummaryTrim = () => ({
  type: SUBMIT_SEND_SUMMARY_TRIM,
});

export const startSendListSync = userId => ({
  type: START_SEND_LIST_SYNC,
  payload: { userId },
});

export const stopSendListSync = () => ({
  type: STOP_SEND_LIST_SYNC,
});

export const startSendSummarySync = () => ({
  type: START_SEND_SUMMARY_SYNC,
});

export const stopSendSummarySync = () => ({
  type: STOP_SEND_SUMMARY_SYNC,
});

export const startSpyMode = user => ({
  type: START_SPY_MODE,
  payload: { user },
});

export const stopSpyMode = () => ({
  type: STOP_SPY_MODE,
});

export const downloadSendListAsCsv = () => ({
  type: DOWNLOAD_SEND_LIST_AS_CSV,
});
