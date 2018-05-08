import React from 'react';
import Button from 'muicss/lib/react/button';
import styled from 'styled-components';

const getCol = name => props => props.palette[name];

// Filters out style-only prop palette,
// to avoid the noisy palette=[object] html attr in the DOM
const FilteredButton = ({ palette, ...whitelistedProps }) => (
  <Button {...whitelistedProps}>{whitelistedProps.children}</Button>
);

const raisedBase = `
  color: ${getCol('contrastText')};
  background-color: ${getCol('main')};
`;

const RaisedButton = styled(FilteredButton)`
  ${raisedBase}
  color: ${getCol('contrastText')};
  background-color: ${getCol('main')};
  &:hover, &:focus, &:active {
    color: ${getCol('contrastText')};
    background-color: ${getCol('light')};
  }
  &[disabled] {
    &:hover, &:focus, &:active {
      ${raisedBase}
    }
  }
`;

export default RaisedButton;
