// Represents the highest sent boulder color for each sector
import { createSelector } from 'reselect';
import colorMap from './collections/colorMap';
import { getPage as paginateSendList, size as sendListSize, toSendMap } from './collections/sendList';
import { getPage as paginateSendSummary, size as sendSummarySize } from './collections/sendSummary';
import { getPage as paginateRanking, createRanking } from './collections/ranking';

// Firebase state getters

export const getSignedInUserId = ({ firebase: { auth } }) => !auth.isEmpty && auth.uid;
export const getSignedInUser = ({ firebase: { profile, auth } }) => (
  !profile.isEmpty && !auth.isEmpty && { ...profile, uid: auth.uid }
);
export const getIsAuthLoading = ({ firebase: { auth, profile } }) => (
  !auth.isLoaded || !profile.isLoaded
);

// UI state getters

const uiStateGetter = propName => state => state.ui[propName];

export const getSelectedColor = uiStateGetter('selectedColor');
export const getSelectedSectors = uiStateGetter('selectedSectors');
export const getSelectedTab = uiStateGetter('selectedTab');
export const getFunRating = uiStateGetter('funRating');
export const getDifficultyRating = uiStateGetter('difficultyRating');
export const getSendList = uiStateGetter('sendList');
export const getSendSummary = uiStateGetter('sendSummary');
export const getSendListPage = uiStateGetter('sendListPage');
export const getSendSummaryPage = uiStateGetter('sendSummaryPage');
export const getRankingPage = uiStateGetter('sendSummaryPage');
export const getIsTableFilterSynced = uiStateGetter('isTableFilterSynced');
export const getSpyModeTarget = uiStateGetter('spyModeTarget');
export const getProvidersForMerge = uiStateGetter('providersForMerge');

export const getSendListSize = state => sendListSize(getSendList(state));
export const getSendSummarySize = state => sendSummarySize(getSendSummary(state));
export const getIsLoading = ({ ui: { loadingProcessIds } }) => loadingProcessIds.length > 0;

export const getSelection = state => ({
  color: getSelectedColor(state),
  sectorIds: getSelectedSectors(state),
});
export const getErrorStates = (
  { ui: { error, errorIgnoreId, isErrorHidden, errorDisplayDuration } },
) => ({
  error,
  ignoreId: errorIgnoreId,
  isHidden: isErrorHidden,
  displayDuration: errorDisplayDuration,
});
export const getSendSubmitStates = state => ({
  color: getSelectedColor(state),
  sectorIds: getSelectedSectors(state),
  funRating: getFunRating(state),
  difficultyRating: getDifficultyRating(state),
  signedInUser: getSignedInUser(state),
  sendList: getSendList(state),
});

export const getIsSpyModeOn = state => !!getSpyModeTarget(state);

// UI Memoized selectors (and their helpers)

export const getSendMap = createSelector(
  getSendList,
  sendList => toSendMap(sendList),
);

export const getIsColorMapMode = state => !getSelectedColor(state);
export const getColorMap = createSelector(
  getIsColorMapMode,
  getSendMap,
  (isColorMapMode, sendMap) => (isColorMapMode ? colorMap(sendMap) : null),
);

const getTableFilters = (state) => {
  const { color, sectorIds } = getSelection(state);
  const useFilters = getIsTableFilterSynced(state);
  return useFilters ? { colors: color, sectorIds } : {};
};

export const getPaginatedSendList = createSelector(
  getSendList,
  getSendListPage,
  getTableFilters,
  (sendList, page, filters) => (
    paginateSendList(sendList, { ...filters, page })
  ),
);

export const getPaginatedSendSummary = createSelector(
  getSendSummary,
  getSendSummaryPage,
  getTableFilters,
  (summary, page, filters) => (
    paginateSendSummary(summary, { ...filters, page })
  ),
);

const getRanking = createSelector(
  getSendSummary,
  summary => createRanking(summary),
);

// UI getters from memoized selectors

export const getPaginatedRanking = state => (
  paginateRanking(getRanking(state), { page: getRankingPage(state) })
);
