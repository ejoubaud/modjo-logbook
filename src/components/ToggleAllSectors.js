import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

import { getSelection } from '../selectors';
import { toggleAllSectors } from '../actions';
import { getMuiTheme } from '../colors';

const ToggleAll = ({ color, sectorIds, toggleAllSectors }) => (
  <MuiThemeProvider theme={getMuiTheme(color)}>
    <Tooltip title={sectorIds.length > 0 ? 'Désélectionner tous les secteurs' : 'Sélectionner tous les secteurs'}>
      <Checkbox
        checked={sectorIds.length > 0}
        onClick={toggleAllSectors}
        color="primary"
      />
    </Tooltip>
  </MuiThemeProvider>
);

const mapStateToProps = getSelection;

const mapDispatchToProps = { toggleAllSectors };

const ConnectedToggleAll = connect(mapStateToProps, mapDispatchToProps)(ToggleAll);

export default ConnectedToggleAll;
