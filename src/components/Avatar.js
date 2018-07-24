import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const Avatar = ({ user, classes }) => (
  <img alt="" src={user.photoURL} className={classes.avatar} />
);

const styles = {
  avatar: {
    width: '20px',
    height: '20px',
    // For ranking
    'span+&': {
      marginLeft: '15px',
    },
    // For name label
    '&+span': {
      marginLeft: '10px',
    },
  },
};

const StyledAvatar = withStyles(styles)(Avatar);

export default StyledAvatar;
