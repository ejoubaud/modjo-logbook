import React from 'react';
import Button from 'muicss/lib/react/button';
import styled from 'styled-components';

import colors from './colors';

const fromPalette = colorRole => props => colors[props.color].palette[colorRole];

// Stops the color prop from propagating downward
// as we override it (vs mui's original color prop)
const FilteredButton = ({ color, ...whitelistedProps }) => (
  <Button {...whitelistedProps}>{colors[color].label}</Button>
);

const base = `
  color: ${fromPalette('contrastText')};
  background-color: ${fromPalette('main')};
`;

const ColorButton = styled(FilteredButton)`
  ${base}
  color: ${fromPalette('contrastText')};
  background-color: ${fromPalette('main')};
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

export default ColorButton;
