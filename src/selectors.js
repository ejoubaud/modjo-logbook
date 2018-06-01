// Represents the highest sent boulder color for each sector
import { createSelector } from 'reselect';
import colorMap from './color-map';

const hasSelectedColor = state => !!state.ui.selectedColor;
const getSendMap = state => state.ui.sendMap;

export const getColorMap = createSelector(
  hasSelectedColor,
  getSendMap,
  (hasSelectedColor, sendMap) => (hasSelectedColor ? null : colorMap(sendMap)),
);
