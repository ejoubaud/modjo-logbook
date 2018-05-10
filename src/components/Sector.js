import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import find from 'lodash/fp/find';

import { toggleSector } from '../actions';
import colors from '../colors';

// We want the whole sector area to trigger a hover/click, but we only want
// the part on the wall to get highlighted, so we duplicate the path,
// one for events/:hover, and a clipped one (with a mask) to actually get hightlighted
const Sector = ({ d, id, highlightMask, className, toggleSector }) => (
  <a
    xlinkHref=""
    onClick={(e) => { e.preventDefault(); toggleSector(id); }}
    className={className}
  >{/* must be a <a> with xlink:href attr present for CSS :hover */}
    <path
      d={d}
      id={`sector-${id}`}
      vectorEffect="non-scaling-stroke"
    />
    <path
      d={d}
      className="Plan-sector-highlight"
      vectorEffect="non-scaling-stroke"
      mask={highlightMask}
    />
  </a>
);

// extracts `hueName` color from palette selectedColor prop
const hue = hueName => (
  (props) => {
    if (!props.selectedColor) return 'grey';
    return colors[props.selectedColor].palette[hueName];
  }
);

// cases: keys are props names, vals are color or hue functions
// returns the first hue or color for which the key prop is truthy, or returns default
const switchHue = (cases, defaultVal) => (
  (props) => {
    const match = find(k => !!props[k], Object.keys(cases));
    const res = cases[match] || defaultVal;
    return css`${res}`; // res can be a (props) => hue function
  }
);

const StyledSector = styled(Sector)`
  pointer-events: all;
  stroke: inherit;
  cursor: pointer;
  .Plan-sector-highlight {
    fill: ${switchHue({ isSelected: hue('dark') }, 'transparent')};
    fill-opacity: .6;
    transition: fill .2s;
  }
  &:hover:active {
    .Plan-sector-highlight {
      fill: ${hue('main')}
    }
  }
  &:hover {
    .Plan-sector-highlight {
      fill: ${switchHue({ isSelected: hue('dark') }, hue('light'))};
    }
  }
`;

const mapStateToProps = (state, props) => ({
  selectedColor: state.ui.selectedColor,
  isSelected: state.ui.selectedSector === props.id,
});

const mapDispatchToProps = { toggleSector };

const ConnectedSector = connect(mapStateToProps, mapDispatchToProps)(StyledSector);

export default ConnectedSector;
