// Represents the highest sent boulder color for each sector
import { createSelector } from 'reselect';
import colorMap from './colorMap';
import { getPage as paginateSendList, size as sendListSize } from './sendList';
import { getPage as paginateSendSummary, size as sendSummarySize } from './sendSummary';

// Firebase state getters

export const getSignedInUser = ({ firebase: { auth } }) => !auth.isEmpty && auth;
export const getIsAuthLoading = ({ firebase: { auth, profile } }) => (
  !auth.isLoaded || !profile.isLoaded
);

// UI state getters

const uiStateGetter = propName => state => state.ui[propName];

export const getSelectedColor = uiStateGetter('selectedColor');
export const getSelectedSectors = uiStateGetter('selectedSectors');
export const getSelectedTab = uiStateGetter('selectedTab');
export const getSendMap = uiStateGetter('sendMap');
export const getSendList = uiStateGetter('sendList');
export const getSendSummary = uiStateGetter('sendSummary');
export const getSendListPage = uiStateGetter('sendListPage');
export const getSendSummaryPage = uiStateGetter('sendSummaryPage');
export const getIsTableFilterSynced = uiStateGetter('isTableFilterSynced');

export const getSendListSize = state => sendListSize(getSendList(state));
export const getSendSummarySize = state => sendSummarySize(getSendSummary(state));
export const getIsLoading = ({ ui: { loadingProcessIds } }) => loadingProcessIds.length > 0;

export const getSelection = state => ({
  color: getSelectedColor(state),
  sectorIds: getSelectedSectors(state),
});
export const getErrorStates = ({ ui: { error, errorIgnoreId, isErrorHidden } }) => ({
  error,
  ignoreId: errorIgnoreId,
  isHidden: isErrorHidden,
});
export const getSendSubmitStates = state => ({
  color: getSelectedColor(state),
  sectorIds: getSelectedSectors(state),
  signedInUser: getSignedInUser(state),
  sendMap: getSendMap(state),
  sendList: getSendList(state),
});
export const getSendSummaries = state => ({
  sendMap: getSendMap(state),
  sendList: getSendList(state),
});

// UI Memoized selectors (and their helpers)

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
