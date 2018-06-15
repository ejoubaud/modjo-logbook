import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';

import { getIsTableFilterSynced, getSelectedColor } from '../../selectors';
import { toggleTableFilterSync } from '../../actions';
import { getPalette } from '../../colors';

const SendHeaderCell = ({ isSyncOn, palette, classes, toggleTableFilterSync }) => {
  const styles = isSyncOn ? { backgroundColor: palette.main, color: palette.contrastText } : {};
  const tip = isSyncOn ? 'Désactiver le filtrage par couleur/type sélectionnés' : 'Filtrer par couleur/type sélectionnés';
  return (
    <Fragment>
      <Hidden xsDown>
        Blocs encha&icirc;n&eacute;s
      </Hidden>
      <Tooltip title={tip}>
        <IconButton
          className={classes.filterButton}
          style={styles}
          onClick={() => toggleTableFilterSync(!isSyncOn)}
        >
          <FilterListIcon className={classes.filterIcon} />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
};

const styles = {
  filterButton: {
    height: '28px',
    width: '28px',
    marginLeft: '5px',
    marginBottom: '3px',
    verticalAlign: 'middle',
  },

  filterIcon: {
    fontSize: '22px',
  },
};

const StyledSendHeaderCell = withStyles(styles)(SendHeaderCell);

const mapStateToProps = state => ({
  palette: getPalette(getSelectedColor(state)),
  isSyncOn: getIsTableFilterSynced(state),
});

const mapDispatchToProps = { toggleTableFilterSync };

const ConnectedSendHeaderCell = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledSendHeaderCell);

export default ConnectedSendHeaderCell;
