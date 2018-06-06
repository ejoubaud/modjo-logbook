export const types = {
  toggleColor: 'TOGGLE_COLOR',
  toggleSector: 'TOGGLE_SECTOR',
  sendBoulders: 'SEND_BOULDERS',
  clearBoulders: 'CLEAR_BOULDERS', // not used anymore
  clearSectors: 'CLEAR_SECTORS',
  syncSendMap: 'SYNC_SEND_MAP',
  syncSendList: 'SYNC_SEND_LIST',
  showError: 'SHOW_ERROR',
  hideError: 'HIDE_ERROR',
  toggleLoading: 'TOGGLE_LOADING',
  rollback: 'ROLLBACK',
};

export const toggleColor = color => ({
  type: types.toggleColor,
  payload: { color },
});

export const toggleSector = sectorId => ({
  type: types.toggleSector,
  payload: { sectorId },
});

export const sendBoulders = sends => ({
  type: types.sendBoulders,
  payload: { sends },
});

// not used anymore (we clear sectors now, not just boulders)
export const clearBoulders = (color, sectors) => ({
  type: types.clearBoulders,
  payload: {
    color,
    sectors,
  },
});

export const clearSectors = sectors => ({
  type: types.clearSectors,
  payload: { sectors },
});

export const syncSendMap = sendMap => ({
  type: types.syncSendMap,
  payload: { sendMap },
});

export const syncSendList = sendList => ({
  type: types.syncSendList,
  payload: { sendList },
});

export const rollback = ({ sendMap, sendList, error }) => ({
  type: types.rollback,
  payload: { previousSendMap: sendMap, previousSendList: sendList, error },
});

// ignoreId is optional
export const showError = (error, ignoreId) => ({
  type: types.showError,
  payload: { error, ignoreId },
});

// ignoreId is optional, if passed this error won't be shown again
export const hideError = ignoreId => ({
  type: types.hideError,
  payload: { ignoreId },
});

export const toggleLoading = on => ({
  type: types.toggleLoading,
  payload: { on },
});
