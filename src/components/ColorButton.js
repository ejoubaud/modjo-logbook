import React from 'react';
import Button from 'muicss/lib/react/button';
import styled, { css } from 'styled-components';

import colors from '../colors';

const fromPalette = colorRole => props => colors[props.color].palette[colorRole];

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
  &[disabled] {
    &:hover, &:focus, &:active {
      ${base}
    }
  }
`;

export default StyledButton;
