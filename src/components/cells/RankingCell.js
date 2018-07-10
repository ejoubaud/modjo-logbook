import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import reverse from 'lodash/fp/reverse';

import { getPalette, colorKeys } from '../../colors';

const orderedColorKeys = reverse(colorKeys);

const RankingCell = ({ entry, classes }) => {
  let visibleFromNowOn = false;
  return (
    <ul className={classes.badgeContainer}>
      { orderedColorKeys.map((color) => {
        const { main, contrastText } = getPalette(color);
        const score = entry.scores[color];
        if (score) visibleFromNowOn = true;
        return (
          <li
            key={color}
            className={classes.badge}
            style={{
              color: contrastText,
              backgroundColor: main,
              visibility: visibleFromNowOn ? 'visible' : 'hidden',
            }}
          >
            { score || '-' }
          </li>
        );
      }) }
    </ul>
  );
};

const styles = {
  badge: {
    display: 'inline-block',
    boxSizing: 'border-box',
    textAlign: 'center',
    width: '20px',
    height: '20px',
    paddingTop: '3px',
    marginRight: '2px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    borderRadius: '12px',
  },
  badgeContainer: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'right',
  },
};

const StyledRankingCell = withStyles(styles)(RankingCell);

const mapStateToProps = () => ({
});

const ConnectedRankingCell = connect(mapStateToProps)(StyledRankingCell);

export default ConnectedRankingCell;
