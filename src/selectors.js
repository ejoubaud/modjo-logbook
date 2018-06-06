// Represents the highest sent boulder color for each sector
import { createSelector } from 'reselect';
import colorMap from './color-map';

const uiStateGetter = propName => state => state.ui[propName];

const hasSelectedColor = state => !!state.ui.selectedColor;

export const getSendMap = uiStateGetter('sendMap');
export const getSendList = uiStateGetter('sendList');

export const getColorMap = createSelector(
  hasSelectedColor,
  getSendMap,
  (hasSelectedColor, sendMap) => (hasSelectedColor ? null : colorMap(sendMap)),
);
