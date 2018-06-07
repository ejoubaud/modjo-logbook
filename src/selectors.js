// Represents the highest sent boulder color for each sector
import { createSelector } from 'reselect';
import colorMap from './colorMap';
import { getPage } from './sendList';

// Firebase state getters

export const getSignedInUser = ({ firebase: { auth } }) => !auth.isEmpty && auth;
export const getIsAuthLoading = ({ firebase: { auth } }) => !auth.isLoaded;

// UI state getters

const uiStateGetter = propName => state => state.ui[propName];

export const getSelectedColor = uiStateGetter('selectedColor');
export const getSelectedSectors = uiStateGetter('selectedSectors');
export const getSendMap = uiStateGetter('sendMap');
export const getSendList = uiStateGetter('sendList');
export const getIsLoading = uiStateGetter('isLoading');

export const getSelection = state => ({
  color: getSelectedColor(state),
  sectorIds: getSelectedSectors(state),
});
export const getErrorStates = ({ ui: { error, errorIgnoreId, isErrorHidden } }) => ({
  error,
  errorIgnoreId,
  isErrorHidden,
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

export const getUserSendPager = createSelector(
  getSendList,
  getSelectedColor,
  getSelectedSectors,
  (sendList, color, sectorIds) => getPage(sendList, { colors: color, sectorIds }),
);
