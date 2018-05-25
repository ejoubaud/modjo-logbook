import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const Icon = ({ icon, classes }) => (
  <i className={`material-icons ${classes.root}`}>{icon}</i>
);

const styles = {
  root: {
    lineHeight: 'inherit',
    fontSize: '1.3rem',
    marginRight: '10px',
    marginLeft: '-5px',
    float: 'left',
  },
};

export default withStyles(styles)(Icon);
