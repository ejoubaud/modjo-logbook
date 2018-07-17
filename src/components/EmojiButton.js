import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { getSelection } from '../selectors';
import { getPalette } from '../models/colors';

const DisabledTip = () => (
  <Fragment>
    Il n&apos;est possible de noter qu&apos;un bloc &agrave; la fois.<br />
    D&eacute;selectionner des secteurs pour activer les notes.
  </Fragment>
);

const EmojiButton = (props) => {
  const { emoji, tip, value, isSelected, isDisabled, selectedColor, classes, dispatch } = props;
  return (
    <Tooltip title={isDisabled ? <DisabledTip /> : tip} placement="top">
      <span>
        <IconButton
          className={`${classes.emojiButton} ${isSelected && classes.selected}`}
          onClick={() => dispatch(value)}
          style={{ backgroundColor: isSelected && getPalette(selectedColor).main }}
          disabled={isDisabled}
        >
          {emoji}
        </IconButton>
      </span>
    </Tooltip>
  );
};

const styles = {
  emojiButton: {
    color: 'black', // sets alpha to 1, from transucid on IconButton
    borderRadius: 0,
  },
};

const StyledEmojiButton = withStyles(styles)(EmojiButton);

const mapStateToProps = (state, props) => {
  const { selector, value } = props;
  const { color, sectorIds } = getSelection(state);
  return {
    isSelected: selector(state) === value,
    isDisabled: sectorIds.length > 1,
    selectedColor: color,
  };
};

const mapDispatchToProps = {};

const ConnectedEmojiButton = connect(mapStateToProps, mapDispatchToProps)(StyledEmojiButton);

export default ConnectedEmojiButton;
