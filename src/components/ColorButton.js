import React from 'react';
import Button from 'muicss/lib/react/button';
import styled, { css } from 'styled-components';

import { getHue } from '../colors';

const fromPalette = hueName => props => getHue(props.color, hueName);

const RawColorButton = ({ color, children, ...otherProps }) => (
  <Button {...otherProps}>
    {children}
  </Button>
);

const base = css`
  color: ${fromPalette('contrastText')};
  background-color: ${fromPalette('main')};
`;

const StyledButton = styled(RawColorButton)`
  ${base}

  &:hover, &:focus, &:active {
    color: ${fromPalette('contrastText')};
    background-color: ${fromPalette('light')};
  }
  &[disabled], &.mui--is-disabled {
    pointer-events: all; // needed for cursor type
    cursor: not-allowed;
    &:hover, &:focus, &:active {
      ${base}
    }
  }
`;

export default StyledButton;
