import React from 'react';
import { connect } from 'react-redux';

import ColorButton from './ColorButton';
import { toggleColor } from '../actions';
import { getSelectedColor } from '../selectors';
import colors from '../models/colors';

const ColorSelector = ({ color, isSelected, toggleColor, ...otherProps }) => (
  <ColorButton color={color} variant={isSelected ? null : 'raised'} {...otherProps} onClick={() => toggleColor(color)}>
    {colors[color].label}
  </ColorButton>
);

const mapStateToProps = (state, props) => (
  { isSelected: getSelectedColor(state) === props.color }
);

const mapDispatchToProps = { toggleColor };

export default connect(mapStateToProps, mapDispatchToProps)(ColorSelector);
