import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import ColorButton from './ColorButton';

const onClick = (enabled, doSubmit) => (
  (e) => {
    e.preventDefault();
    if (enabled) doSubmit();
  }
);

const SubmitButton = ({ label, Icon, color, disabledReason, defaultTip, classes, doSubmit }) => {
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
          <Icon className={classes.icon} />{label}
        </ColorButton>
      </span>
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
};

const StyledSubmitButton = withStyles(styles)(SubmitButton);

export default StyledSubmitButton;
