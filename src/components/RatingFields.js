import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';

import EmojiButton from './EmojiButton';
import { getSelection, getFunRating, getDifficultyRating } from '../selectors';
import { toggleFunRating, toggleDifficultyRating } from '../actions';
import funRatings from '../models/funRatings';
import difficultyRatings from '../models/difficultyRatings';

const RatingFields = (props) => {
  const { noSendReason, classes, selection, toggleFunRating, toggleDifficultyRating } = props;
  const { color, sectorIds } = selection;
  // Don't show unless selector and color are selected
  if (sectorIds.length === 0 || !color) return null;

  const funConnect = { selector: getFunRating, dispatch: toggleFunRating };
  const difficultyConnect = { selector: getDifficultyRating, dispatch: toggleDifficultyRating };
  return (
    <div className={classes.container}>
      <Paper className={classes.group} elevation={1}>
        <InputLabel className={classes.label}>Int&eacute;r&ecirc;t</InputLabel>
        <div className={classes.buttons}>
          { funRatings.map(({ emoji, description, value }) => (
            <EmojiButton
              key={value}
              emoji={emoji}
              value={value}
              tip={description}
              noSendReason={noSendReason}
              {...funConnect}
            />
          )) }
        </div>
      </Paper>

      <Paper className={classes.group} elevation={1}>
        <InputLabel className={classes.label}>Difficult&eacute;</InputLabel>
        <div className={classes.buttons}>
          { difficultyRatings.map(({ emoji, description, value }) => (
            <EmojiButton
              key={value}
              emoji={emoji}
              value={value}
              tip={description}
              noSendReason={noSendReason}
              {...difficultyConnect}
            />
          )) }
        </div>
      </Paper>
    </div>
  );
};

const smallScreenMediaQuery = '@media (max-width: 433px)';

const styles = {
  container: {
    marginBottom: '8px',
  },

  group: {
    display: 'inline-block',
    [smallScreenMediaQuery]: {
      display: 'block',
    },
    '&:before,&:after': {
      display: 'table',
      content: '" "',
    },
    '&:after': {
      clear: 'both',
    },
  },

  buttons: {
    [smallScreenMediaQuery]: {
      float: 'right',
    },
  },

  label: {
    display: 'block',
    fontSize: '12px',
    paddingTop: '10px',
    paddingBottom: '2px',
    [smallScreenMediaQuery]: {
      float: 'left',
      paddingTop: '18px',
      paddingLeft: '10px',
    },
  },
};

const StyledRatingFields = withStyles(styles)(RatingFields);

const mapStateToProps = state => ({
  selection: getSelection(state),
});

const mapDispatchToProps = { toggleFunRating, toggleDifficultyRating };

const ConnectedRatingFields = connect(mapStateToProps, mapDispatchToProps)(StyledRatingFields);

export default ConnectedRatingFields;
