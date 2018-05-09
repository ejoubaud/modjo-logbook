export const types = {
  toggleColor: 'TOGGLE_COLOR',
  toggleSector: 'TOGGLE_SECTOR',
};

export const toggleColor = color => ({
  type: types.toggleColor,
  payload: { color },
});

export const toggleSector = sectorId => ({
  type: types.toggleSector,
  payload: { sectorId },
});
