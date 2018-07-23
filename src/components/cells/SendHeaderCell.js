import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import FileDownloadIcon from '@material-ui/icons/FileDownload';

import { getIsTableFilterSynced, getSelectedColor } from '../../selectors';
import { toggleTableFilterSync, downloadSendListAsCsv } from '../../actions';
import { getPalette } from '../../models/colors';

const SendHeaderCell = (props) => {
  const {
    isSyncOn,
    showDownloadButton,
    palette,
    classes,
    toggleTableFilterSync,
    downloadSendListAsCsv,
  } = props;

  const styles = isSyncOn ? { backgroundColor: palette.main, color: palette.contrastText } : {};
  const tip = isSyncOn ? 'Désactiver le filtrage par couleur/type sélectionnés' : 'Filtrer par couleur/type sélectionnés';
  return (
    <Fragment>
      <Hidden xsDown>
        Blocs valid&eacute;s
      </Hidden>
      <Tooltip title={tip}>
        <IconButton
          className={classes.iconButton}
          style={styles}
          onClick={() => toggleTableFilterSync(!isSyncOn)}
        >
          <FilterListIcon className={classes.icon} />
        </IconButton>
      </Tooltip>

      { showDownloadButton && (
        <Tooltip title="Tout t&eacute;l&eacute;charger en CSV/Excel">
          <IconButton
            className={classes.iconButton}
            style={styles}
            onClick={() => downloadSendListAsCsv()}
          >
            <FileDownloadIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      ) }
    </Fragment>
  );
};

const styles = {
  iconButton: {
    height: '28px',
    width: '28px',
    marginLeft: '5px',
    marginBottom: '3px',
    verticalAlign: 'middle',
  },

  icon: {
    fontSize: '22px',
  },
};

const StyledSendHeaderCell = withStyles(styles)(SendHeaderCell);

const mapStateToProps = state => ({
  palette: getPalette(getSelectedColor(state)),
  isSyncOn: getIsTableFilterSynced(state),
});

const mapDispatchToProps = { toggleTableFilterSync, downloadSendListAsCsv };

const ConnectedSendHeaderCell = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledSendHeaderCell);

export default ConnectedSendHeaderCell;
