export const types = {
  selectColor: 'SELECT_COLOR',
  unselectColor: 'UNSELECT_COLOR',
  toggleSector: 'TOGGLE_SECTOR',
};

export const selectColor = color => ({
  type: types.selectColor,
  payload: { color },
});

export const unselectColor = () => (
  { type: types.unselectColor }
);

export const toggleSector = sectorId => ({
  type: types.toggleSector,
  payload: { sectorId },
});
