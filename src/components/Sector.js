import React from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { toggleSector } from '../actions';
import colors, { getMuiTheme } from '../colors';
import { isSent as isSectorSent } from '../send-map';
import { getColorMap } from '../selectors';

// We want the whole sector area to trigger a hover/click, but we only want
// the part on the wall to get highlighted, so we duplicate the path,
// one for events/:hover, and a clipped one (with a mask) to actually get hightlighted
const Sector = ({
  d,
  id,
  highlightMask,
  classes,
  tooltip,
  canSelect,
  isSent,
  isSelected,
  toggleSector,
}) => (
  <Tooltip title={tooltip}>
    <a
      xlinkHref=""
      onClick={(e) => { e.preventDefault(); if (canSelect) toggleSector(id); }}
      className={classNames(classes.root, { [classes.canSelect]: canSelect })}
    >{/* must be a <a> with xlink:href attr present for CSS :hover */}
      <path
        d={d}
        id={`sector-${id}`}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        className={
          classNames({
            [classes.highlight]: true,
            [classes.highlightSent]: isSent,
            [classes.highlightSelected]: isSelected,
          })
        }
        vectorEffect="non-scaling-stroke"
        mask={highlightMask}
      />
    </a>
  </Tooltip>
);

const styles = theme => ({
  root: {
    pointerEvents: 'all',
    stroke: 'inherit',
    cursor: 'not-allowed',
    '&:focus, &:active': {
      outline: 'none',
    },
    '&:hover:active': {
      '& $highlight': {
        fill: theme.palette.primary.main,
      },
      '& $highlightSent': {
        fill: theme.palette.primary.main,
      },
    },
    '&:hover': {
      '& $highlight': {
        fill: theme.palette.primary.light,
      },
      '& $highlightSelected': {
        fill: theme.palette.primary.dark,
      },
    },
  },
  canSelect: {
    cursor: 'pointer',
  },
  highlight: {
    fill: 'transparent',
    fillOpacity: '.6',
    transition: 'fill .2s',
  },
  highlightSent: {
    fill: theme.palette.primary.main,
  },
  highlightSelected: {
    fill: theme.palette.primary.dark,
  },
});

const StyledSector = withStyles(styles)(Sector);

const ThemedSector = ({ children, color, ...props }) => (
  <MuiThemeProvider theme={getMuiTheme(color || null)}>
    <StyledSector color={color} {...props} >
      {children}
    </StyledSector>
  </MuiThemeProvider>
);

const tooltipContent = (isColorMapMode, isSent, color) => {
  if (isColorMapMode) {
    if (isSent) return `Bloc le plus difficile passé sur ce secteur: ${colors[color].label}`;
    return 'Aucun bloc enchaîné, sélectionner une couleur pour marquer ce bloc comme enchaîné';
  }
  return '';
};

const mapStateToProps = (state, props) => {
  const { selectedColor, sendMap } = state.ui;
  const sectors = state.ui.selectedSectors;
  // when no color is selected, we show the colors from the colorMap
  const isColorMapMode = !selectedColor;
  const color = isColorMapMode ? getColorMap(state)[props.id] : selectedColor;
  // in color map mode, show as sent if it has any send (any color for sector in color map)
  const isSent = isColorMapMode
    ? !!color
    : isSectorSent(sendMap, selectedColor, props.id);
  return {
    color,
    isSelected: sectors.indexOf(props.id) >= 0,
    canSelect: true,
    isSent,
    tooltip: tooltipContent(isColorMapMode, isSent, color),
  };
};

const mapDispatchToProps = { toggleSector };

const ConnectedSector = connect(mapStateToProps, mapDispatchToProps)(ThemedSector);

export default ConnectedSector;
