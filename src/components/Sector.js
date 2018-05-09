import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import colors from '../colors';

// We want the whole sector area to trigger a hover/click, but we only want
// the part on the wall to get highlighted, so we duplicate the path,
// one for events/:hover, and a clipped one (with a mask) to actually get hightlighted
const Sector = ({ d, id, highlightMask, className }) => (
  <a
    xlinkHref=""
    onClick={e => e.preventDefault()}
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
  &:hover, &:focus {
    .Plan-sector-highlight {
      fill: ${selectedColorHue('light')};
      fill-opacity: .8;
    }
  }
`;

const mapStateToProps = state => ({ selectedColor: state.ui.selectedColor });

const ConnectedSector = connect(mapStateToProps)(StyledSector);

export default ConnectedSector;
