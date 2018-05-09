import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
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

export const selectedColorHue = paletteHueName => (
  (props) => {
    if (!props.selectedColor) return 'grey';
    return colors[props.selectedColor].palette[paletteHueName];
  }
);

const StyledSector = styled(Sector)`
  pointer-events: all;
  stroke: inherit;
  cursor: pointer;
  .Plan-sector-highlight {
    fill: ${props => (props.isSelected ? selectedColorHue('dark')(props) : 'transparent')};
    fill-opacity: .6;
    transition: fill .2s;
  }
  &:hover:active {
    .Plan-sector-highlight {
      fill: ${selectedColorHue('main')}
    }
  }
  &:hover {
    .Plan-sector-highlight {
      fill: ${props => (props.isSelected ? selectedColorHue('dark')(props) : selectedColorHue('light')(props))};
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
