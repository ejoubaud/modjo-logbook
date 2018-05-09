import React from 'react';
import { connect } from 'react-redux';
import Button from 'muicss/lib/react/button';
import styled, { css } from 'styled-components';

import { selectColor } from './actions';
import colors from './colors';

const fromPalette = colorRole => props => colors[props.color].palette[colorRole];

const RawColorButton = ({ color, selectColor, ...otherProps }) => (
  <Button {...otherProps} onClick={() => selectColor(color)}>
    {colors[color].label}
  </Button>
);

const base = css`
  color: ${fromPalette('contrastText')};
  background-color: ${fromPalette('main')};
`;

const baseStyle = css`
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

const selectedBase = css`
  color: ${fromPalette('main')};
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.2);
  background-color: transparent;
`;

const selectedStyle = css`
  ${selectedBase}
  &:focus {
    color: ${fromPalette('main')};
  }
  &:hover {
    background-color: #F2F2F2;
  }
`;

const StyledButton = styled(RawColorButton)`
  ${props => (props.selected ? selectedStyle : baseStyle)}
`;

const mapStateToProps = (state, props) => (
  { selected: state.ui.selectedColor === props.color }
);

const mapDispatchToProps = { selectColor };

export default connect(mapStateToProps, mapDispatchToProps)(StyledButton);
