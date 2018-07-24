import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import formatDistance from 'date-fns/distance_in_words';
import differenceInDays from 'date-fns/difference_in_days';
import format from 'date-fns/format';
import fr from 'date-fns/locale/fr';

import { sharedTooltipTouchConfig } from '../shared';

const dateFormat = 'ddd DD/MM HH:mm';

const DateCell = ({ date }) => {
  const now = new Date();
  const formatted = format(date, dateFormat, { locale: fr });
  if (differenceInDays(date, now) > 2) return <span>formatted</span>;
  return (
    <Tooltip title={formatted} {...sharedTooltipTouchConfig}>
      <span>{formatDistance(date, now, { locale: fr })}</span>
    </Tooltip>
  );
};

export default DateCell;
