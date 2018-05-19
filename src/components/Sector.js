import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import find from 'lodash/fp/find';

import { toggleSector } from '../actions';
import { getHue } from '../colors';
import { isSent as isSectorSent } from '../send-map';

// We want the whole sector area to trigger a hover/click, but we only want
// the part on the wall to get highlighted, so we duplicate the path,
// one for events/:hover, and a clipped one (with a mask) to actually get hightlighted
const Sector = ({ d, id, highlightMask, className, canSelect, toggleSector }) => (
  <a
    xlinkHref=""
    onClick={(e) => { e.preventDefault(); if (canSelect) toggleSector(id); }}
    className={className}
    data-tip="S&eacute;lectionner une couleur d'abord"
    data-tip-disable={canSelect}
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
const hue = hueName => props => getHue(props.color, hueName);

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
  cursor: ${props => (props.canSelect ? 'pointer' : 'not-allowed')};
  .Plan-sector-highlight {
    fill: ${switchHue({ isSelected: hue('dark'), isSent: hue('main') }, 'transparent')};
    fill-opacity: .6;
    transition: fill .2s;
  }
  &:focus, &:active {
    outline: none;
  }
  &:hover:active {
    .Plan-sector-highlight {
      fill: ${switchHue({ isSent: hue('light') }, hue('main'))}
    }
  }
  &:hover {
    .Plan-sector-highlight {
      fill: ${switchHue({ isSelected: hue('dark') }, hue('light'))};
    }
  }
`;

const mapStateToProps = (state, props) => {
  const color = state.ui.selectedColor;
  const sectors = state.ui.selectedSectors;
  const isSent = isSectorSent(state.ui.sendMap, color); // curried sendMap.isSent
  return {
    color,
    isSelected: sectors.indexOf(props.id) >= 0,
    // can only select groups of either sent or unsent sectors, not mix both in a selection
    canSelect: !!color,
    isSent: isSent(props.id),
  };
};

const mapDispatchToProps = { toggleSector };

const ConnectedSector = connect(mapStateToProps, mapDispatchToProps)(StyledSector);

export default ConnectedSector;
