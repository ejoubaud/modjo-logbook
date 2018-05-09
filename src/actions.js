export const types = {
  selectColor: 'SELECT_COLOR',
  unselectColor: 'UNSELECT_COLOR',
};

export const selectColor = color => ({
  type: types.selectColor,
  payload: { color },
});

export const unselectColor = () => (
  { type: types.unselectColor }
);
