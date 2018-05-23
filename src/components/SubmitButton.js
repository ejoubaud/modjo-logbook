import React from 'react';

import LeftIcon from './LeftIcon';
import ColorButton from './ColorButton';

const onClick = (enabled, doSubmit) => (
  (e) => {
    e.preventDefault();
    if (enabled) doSubmit();
  }
);

export default ({ label, icon, color, disabledReason, defaultTip, doSubmit }) => {
  const enabled = !disabledReason;
  return (
    <ColorButton
      color={color}
      className={enabled || 'mui--is-disabled'}
      onClick={onClick(enabled, doSubmit)}
      data-tip={disabledReason || defaultTip}
      data-tip-disable={enabled && !defaultTip}
      data-html
    >
      <LeftIcon icon={icon} />{label}
    </ColorButton>
  );
};
