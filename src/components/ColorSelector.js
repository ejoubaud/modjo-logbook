import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import ColorButton from './ColorButton';
import { toggleColor } from '../actions';
import colors from '../colors';

const fromPalette = colorRole => props => colors[props.color].palette[colorRole];

const RawColorButton = ({ color, selected, toggleColor, ...otherProps }) => (
  <ColorButton color={color} {...otherProps} onClick={() => toggleColor(color)}>
    {colors[color].label}
  </ColorButton>
);

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
  ${props => (props.selected && selectedStyle)}
`;

const mapStateToProps = (state, props) => (
  { selected: state.ui.selectedColor === props.color }
);

const mapDispatchToProps = { toggleColor };

export default connect(mapStateToProps, mapDispatchToProps)(StyledButton);
