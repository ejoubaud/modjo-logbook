export const types = {
  toggleColor: 'TOGGLE_COLOR',
  toggleSector: 'TOGGLE_SECTOR',
  sendBoulders: 'SEND_BOULDERS',
  clearBoulders: 'CLEAR_BOULDERS',
  syncSendMap: 'SYNC_SEND_MAP',
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

export const sendBoulders = (color, sectors, { type }) => ({
  type: types.sendBoulders,
  payload: {
    sends: sectors.map(sectorId => ({
      color,
      sectorId,
      type,
      sentAt: new Date(), // TODO: Implement in form
      createdAt: new Date(),
    })),
  },
});

export const clearBoulders = (color, sectors) => ({
  type: types.clearBoulders,
  payload: {
    color,
    sectors,
  },
});

export const syncSendMap = sendMap => ({
  type: types.syncSendMap,
  payload: { sendMap },
});

export const rollback = (previousSendMap, error) => ({
  type: types.rollback,
  payload: { previousSendMap, error },
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
