import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import EmojiButton from './EmojiButton';
import { getFunRating, getDifficultyRating } from '../selectors';
import { toggleFunRating, toggleDifficultyRating } from '../actions';
import funRatings from '../models/funRatings';
import difficultyRatings from '../models/difficultyRatings';

const RatingFields = ({ classes, toggleFunRating, toggleDifficultyRating }) => {
  const funConnect = { selector: getFunRating, dispatch: toggleFunRating };
  const difficultyConnect = { selector: getDifficultyRating, dispatch: toggleDifficultyRating };
  return (
    <div>
      <Paper className={classes.group}>
        { funRatings.map(({ emoji, description, value }) => (
          <EmojiButton
            key={value}
            emoji={emoji}
            value={value}
            tip={description}
            {...funConnect}
          />
        )) }
      </Paper>

      <Paper className={classes.group}>
        { difficultyRatings.map(({ emoji, description, value }) => (
          <EmojiButton
            key={value}
            emoji={emoji}
            value={value}
            tip={description}
            {...difficultyConnect}
          />
        )) }
      </Paper>
    </div>
  );
};

const styles = {
  group: {
    display: 'inline-block',
    '@media (max-width: 433px)': {
      display: 'block',
    },
  },
};

const StyledRatingFields = withStyles(styles)(RatingFields);

const mapStateToProps = () => ({
});

const mapDispatchToProps = { toggleFunRating, toggleDifficultyRating };

const ConnectedRatingFields = connect(mapStateToProps, mapDispatchToProps)(StyledRatingFields);

export default ConnectedRatingFields;
