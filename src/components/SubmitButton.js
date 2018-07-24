import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import ColorButton from './ColorButton';
import { sharedTooltipTouchConfig } from './shared';

const onClick = (enabled, doSubmit) => (
  (e) => {
    e.preventDefault();
    if (enabled) doSubmit();
  }
);

const SubmitButton = ({ label, Icon, color, disabledReason, defaultTip, classes, doSubmit }) => {
  const isDisabled = !!disabledReason;
  const tip = disabledReason || defaultTip || '';
  return (
    <Tooltip title={tip} {...sharedTooltipTouchConfig}>
      <ColorButton
        color={color}
        className={isDisabled && classes.disabled}
        onClick={onClick(!isDisabled, doSubmit)}
        disableRipple={isDisabled}
      >
        <Icon className={classes.icon} />{label}
      </ColorButton>
    </Tooltip>
  );
};

const styles = {
  icon: {
    lineHeight: 'inherit',
    fontSize: '1.3rem',
    marginRight: '10px',
    marginLeft: '-5px',
    float: 'left',
  },

  // use a disabled style rather than disable button so as to show the tooltip
  disabled: {
    color: 'rgba(0, 0, 0, 0.26)',
    boxShadow: 'none',
    cursor: 'default',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    fontWeight: 400,
    '&:hover,&:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
      boxShadow: 'none',
    },
  },
};

const StyledSubmitButton = withStyles(styles)(SubmitButton);

export default StyledSubmitButton;
