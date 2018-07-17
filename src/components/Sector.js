import React from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';

import { toggleSector } from '../actions';
import { getColorMap, getSelectedColor, getSelectedSectors, getSendMap } from '../selectors';
import { isSent as isSectorSent } from '../collections/sendMap';
import { getPalette } from '../models/colors';

// We want the whole sector area to trigger a hover/click, but we only want
// the part on the wall to get highlighted, so we duplicate the path,
// one for events/:hover, and a clipped one (with a mask) to actually get hightlighted
const Sector = ({
  d,
  id,
  highlightMask,
  classes,
  toggleSector,
}) => (
  <a
    xlinkHref=""
    onClick={(e) => { e.preventDefault(); toggleSector(id); }}
    className={classes.root}
  >{/* must be a <a> with xlink:href attr present for CSS :hover */}
    <path
      d={d}
      id={`sector-${id}`}
      vectorEffect="non-scaling-stroke"
    />
    <path
      d={d}
      className={classes.highlight}
      vectorEffect="non-scaling-stroke"
      mask={highlightMask}
    />
  </a>
);

const getHighlightFill = ({ isSelected, isSent, anySectorSelected, isColorMapMode, color }) => {
  const { main, light } = getPalette(color);
  const defaultPalette = getPalette(null);
  return {
    atRest: (() => {
      if (isSelected) {
        if (isSent) return defaultPalette.dark;
        return defaultPalette.main;
      }
      if (isSent) {
        if (anySectorSelected) return light;
        return main;
      }
      return 'transparent';
    })(),
    onHover: (() => {
      if (isSelected) {
        if (isSent) return defaultPalette.main;
        return defaultPalette.light;
      }
      if (isSent) return defaultPalette.main;
      return defaultPalette.light;
    })(),
    onActive: (() => {
      if (isSent) return defaultPalette.light;
      return defaultPalette.main;
    })(),
  };
};

const styles = {
  root: {
    pointerEvents: 'all',
    cursor: 'pointer',
    stroke: 'inherit',
    '&:focus, &:active': {
      outline: 'none',
    },
    '&:hover:active': {
      '& $highlight': {
        fill: ({ highlightFill: { onActive } }) => onActive,
      },
    },
    '&:hover': {
      '& $highlight': {
        fill: ({ highlightFill: { onHover } }) => onHover,
      },
    },
  },

  highlight: ({ highlightFill: { atRest } }) => ({
    transition: 'fill .2s',
    fill: atRest,
    fillOpacity: '.6',
  }),
};

const StyledSector = injectSheet(styles)(Sector);

const mapStateToProps = (state, props) => {
  const selectedColor = getSelectedColor(state);
  const selectedSectorIds = getSelectedSectors(state);
  const sendMap = getSendMap(state);
  // when no color is selected, we show the colors from the colorMap
  const isColorMapMode = !selectedColor;
  const color = isColorMapMode ? getColorMap(state)[props.id] : selectedColor;
  // in color map mode, show as sent if it has any send (any color for sector in color map)
  const isSent = isColorMapMode
    ? !!color
    : isSectorSent(sendMap, selectedColor, props.id);
  const isSelected = selectedSectorIds.indexOf(props.id) >= 0;
  const anySectorSelected = selectedSectorIds.length > 0;
  const highlightFill = getHighlightFill(
    { isSelected, isSent, anySectorSelected, isColorMapMode, color }
  );
  return {
    color,
    isSent,
    isSelected,
    highlightFill,
  };
};

const mapDispatchToProps = { toggleSector };

const ConnectedSector = connect(mapStateToProps, mapDispatchToProps)(StyledSector);

export default ConnectedSector;
