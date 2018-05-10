export const types = {
  toggleColor: 'TOGGLE_COLOR',
  toggleSector: 'TOGGLE_SECTOR',
  sendBoulder: 'SEND_BOULDER',
};

export const toggleColor = color => ({
  type: types.toggleColor,
  payload: { color },
});

export const toggleSector = sectorId => ({
  type: types.toggleSector,
  payload: { sectorId },
});

export const sendBoulder = (color, sectorId, { type }) => ({
  type: types.sendBoulder,
  payload: {
    color,
    sectorId,
    type,
    sentAt: new Date(), // TODO: Implement in form
    createdAt: new Date(),
  },
});
