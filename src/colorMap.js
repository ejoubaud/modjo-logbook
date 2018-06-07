import findLast from 'lodash/fp/findLast';
import map from 'lodash/fp/map';
import keys from 'lodash/fp/keys';
import fromPairs from 'lodash/fp/fromPairs';

import colors from './colors';
import sectors from './sectors';
import { isSent } from './sendMap';

const defaultOrderedColors = keys(colors);
const defaultSectorIds = map(s => s.id, sectors);

export default (
  sendMap,
  sectorIds = defaultSectorIds,
  orderedColors = defaultOrderedColors,
) => (
  fromPairs(
    sectorIds.map((sectorId) => {
      const firstColor = findLast(color => (
        isSent(sendMap, color, sectorId)
      ), orderedColors);
      return [sectorId, firstColor];
    }),
  )
);
