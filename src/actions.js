export const types = { selectColor: 'SELECT_COLOR' };

export const selectColor = color => ({
  type: types.selectColor,
  payload: { color },
});
