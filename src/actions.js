export const types = {
  toggleColor: 'TOGGLE_COLOR',
  toggleSector: 'TOGGLE_SECTOR',
  sendBoulders: 'SEND_BOULDERS',
  clearBoulders: 'CLEAR_BOULDERS',
  showError: 'SHOW_ERROR',
  hideError: 'HIDE_ERROR',
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

export const showError = (error) => ({
  type: types.showError,
  payload: { error, ignoreId },
});

// ignoreId is optional, if passed this error won't be shown again
export const hideError = ignoreId => ({
  type: types.hideError,
  payload: { ignoreId },
});
