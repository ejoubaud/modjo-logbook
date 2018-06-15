import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import FlashIcon from '@material-ui/icons/FlashOn';

import colors from '../../colors';
import ColorButton from '../ColorButton';
import { toggleColor, toggleSector } from '../../actions';
import { getSelection } from '../../selectors';

const SendCell = ({ send, selectedColor, selectedSectors, classes, toggleColor, toggleSector }) => {
  const { type, color, sectorId } = send;
  return (
    <Fragment>
      { color && (
        <ColorButton
          variant={(selectedColor === color) ? 'raised' : 'flat'}
          size="small"
          color={color}
          onClick={() => toggleColor(color)}
        >
          {colors[color].label}
        </ColorButton>
      ) }

      { (type === 'clear') && (
        <Tooltip title="Secteur d&eacute;mont&eacute; / r&eacute;ouvert">
          <RefreshIcon className={classes.clearIcon} />
        </Tooltip>
      ) }

      <IconButton
        onClick={() => toggleSector(sectorId)}
        className={`${classes.sectorButton} ${selectedSectors.indexOf(sectorId) >= 0 && classes.sectorButtonSelected}`}
      >
        {sectorId}
      </IconButton>

      { (type === 'flash') && (
        <Tooltip title="Flash&eacute;"><FlashIcon className={classes.typeIcon} /></Tooltip>
      ) }
    </Fragment>
  );
};

const styles = {
  sectorButton: {
    height: '28px',
    width: '28px',
    fontSize: '18px',
  },

  sectorButtonSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  typeIcon: {
    verticalAlign: 'middle',
    marginLeft: '7px',
  },

  clearIcon: {
    verticalAlign: 'middle',
    // to align with the color buttons
    width: '64px',
    marginRight: '4px',
  },
};

const StyledSendCell = withStyles(styles)(SendCell);

const mapStateToProps = (state) => {
  const { color, sectorIds } = getSelection(state);
  return {
    selectedColor: color,
    selectedSectors: sectorIds,
  };
};

const mapDispatchToProps = { toggleColor, toggleSector };

const ConnectedSendCell = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledSendCell);

export default ConnectedSendCell;
