import React from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { toggleSector } from '../actions';
import { isSent as isSectorSent } from '../send-map';

// We want the whole sector area to trigger a hover/click, but we only want
// the part on the wall to get highlighted, so we duplicate the path,
// one for events/:hover, and a clipped one (with a mask) to actually get hightlighted
const Sector = ({ d, id, highlightMask, classes, canSelect, isSent, isSelected, toggleSector }) => (
  <Tooltip title={canSelect ? '' : "Sélectionner une couleur d'abord"}>
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

const mapStateToProps = (state, props) => {
  const color = state.ui.selectedColor;
  const sectors = state.ui.selectedSectors;
  const isSent = isSectorSent(state.ui.sendMap, color); // curried sendMap.isSent
  return {
    color,
    isSelected: sectors.indexOf(props.id) >= 0,
    canSelect: !!color,
    isSent: isSent(props.id),
  };
};

const mapDispatchToProps = { toggleSector };

const ConnectedSector = connect(mapStateToProps, mapDispatchToProps)(StyledSector);

export default ConnectedSector;
