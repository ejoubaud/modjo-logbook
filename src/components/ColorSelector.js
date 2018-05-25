import React from 'react';
import { connect } from 'react-redux';

import ColorButton from './ColorButton';
import { toggleColor } from '../actions';
import colors from '../colors';

const ColorSelector = ({ color, isSelected, toggleColor, ...otherProps }) => (
  <ColorButton color={color} variant={isSelected ? null : 'raised'} {...otherProps} onClick={() => toggleColor(color)}>
    {colors[color].label}
  </ColorButton>
);

const mapStateToProps = (state, props) => (
  { isSelected: state.ui.selectedColor === props.color }
);

const mapDispatchToProps = { toggleColor };

export default connect(mapStateToProps, mapDispatchToProps)(ColorSelector);
