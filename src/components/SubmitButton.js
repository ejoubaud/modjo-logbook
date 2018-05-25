import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import LeftIcon from './LeftIcon';
import ColorButton from './ColorButton';

const onClick = (enabled, doSubmit) => (
  (e) => {
    e.preventDefault();
    if (enabled) doSubmit();
  }
);

export default ({ label, icon, color, disabledReason, defaultTip, doSubmit }) => {
  const disabled = !!disabledReason;
  const tip = disabledReason || defaultTip || '';
  return (
    <Tooltip title={tip}>
      <span>
        <ColorButton
          color={color}
          disabled={disabled}
          onClick={onClick(!disabled, doSubmit)}
        >
          <LeftIcon icon={icon} />{label}
        </ColorButton>
      </span>
    </Tooltip>
  );
};
