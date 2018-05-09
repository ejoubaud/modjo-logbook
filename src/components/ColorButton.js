import React from 'react';
import { connect } from 'react-redux';
import Button from 'muicss/lib/react/button';
import styled, { css } from 'styled-components';

import { selectColor, unselectColor } from '../actions';
import colors from '../colors';

const fromPalette = colorRole => props => colors[props.color].palette[colorRole];

const RawColorButton = ({ color, selected, selectColor, unselectColor, ...otherProps }) => (
  <Button {...otherProps} onClick={() => (selected ? unselectColor() : selectColor(color))}>
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
  &:focus, &:hover {
    color: ${fromPalette('main')};
    background-color: #F2F2F2;
  }
`;

const StyledButton = styled(RawColorButton)`
  ${props => (props.selected ? selectedStyle : baseStyle)}
`;

const mapStateToProps = (state, props) => (
  { selected: state.ui.selectedColor === props.color }
);

const mapDispatchToProps = { selectColor, unselectColor };

export default connect(mapStateToProps, mapDispatchToProps)(StyledButton);
