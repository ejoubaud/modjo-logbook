import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

import { getIsSectorMultiSelectMode } from '../selectors';
import { toggleSectorMultiSelectMode } from '../actions';
import { getMuiTheme } from '../models/colors';

const toggleSectorMultiSelect = ({ isSectorMultiSelectMode, toggleSectorMultiSelectMode }) => (
  <MuiThemeProvider theme={getMuiTheme(null)}>
    <Tooltip title={isSectorMultiSelectMode ? 'Désactiver la sélection multiple' : 'Activer la sélection multiple (plusieurs secteurs à la fois)'}>
      <Checkbox
        checked={isSectorMultiSelectMode}
        onClick={toggleSectorMultiSelectMode}
        color="primary"
      />
    </Tooltip>
  </MuiThemeProvider>
);

const mapStateToProps = state => ({
  isSectorMultiSelectMode: getIsSectorMultiSelectMode(state),
});

const mapDispatchToProps = { toggleSectorMultiSelectMode };

const ConnectedToggleSectorMultiSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toggleSectorMultiSelect);

export default ConnectedToggleSectorMultiSelect;
