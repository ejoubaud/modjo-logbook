import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import { getMuiTheme } from '../colors';

const ColorButton = ({ color, children, classes, variant = 'raised', ...otherProps }) => (
  <MuiThemeProvider theme={getMuiTheme(color)}>
    <Button variant={variant} color="primary" className={classes.root} {...otherProps}>
      {children}
    </Button>
  </MuiThemeProvider>
);

const rootStyles = { margin: '4px', marginLeft: 0 };

const StyledColorButton = withStyles({ root: rootStyles })(ColorButton);

export default StyledColorButton;
