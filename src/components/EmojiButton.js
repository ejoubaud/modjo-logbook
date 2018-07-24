import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { sharedTooltipTouchConfig } from './shared';
import { getSelection } from '../selectors';
import { getPalette } from '../models/colors';

const MultiSelectTip = () => (
  <Fragment>
    Il n&apos;est possible de noter qu&apos;un bloc &agrave; la fois.<br />
    D&eacute;s&eacute;lectionner des secteurs pour activer les notes.<br />
    Ou vous pouvez marquer plusieurs blocs comme valid&eacute;s<br />
    sans note.
  </Fragment>
);

const EmojiButton = (props) => {
  const {
    emoji,
    tip,
    value,
    noSendReason,
    isSelected,
    selectedColor,
    selectedSectorIds,
    classes,
    dispatch,
  } = props;

  const isDisabled = !!noSendReason || selectedSectorIds.length > 1;

  return (
    <Tooltip
      title={isDisabled ? (noSendReason || <MultiSelectTip />) : tip}
      placement="top"
      {...sharedTooltipTouchConfig}
    >
      <IconButton
        className={`${classes.emojiButton} ${isSelected && classes.selected} ${isDisabled && classes.disabled}`}
        onClick={() => { if (!isDisabled) dispatch(value); }}
        style={{ backgroundColor: isSelected && getPalette(selectedColor).main }}
        disableRipple={isDisabled}
      >
        {emoji}
      </IconButton>
    </Tooltip>
  );
};

const styles = {
  emojiButton: {
    color: 'black', // sets alpha to 1, from transucid on IconButton
    borderRadius: 0,
  },

  // use a disabled style rather than disable button so as to show the tooltip
  disabled: {
    opacity: '0.5',
    cursor: 'default',
    '&:hover,&:active': {
      backgroundColor: 'initial',
      boxShadow: 'none',
    },
  },
};

const StyledEmojiButton = withStyles(styles)(EmojiButton);

const mapStateToProps = (state, props) => {
  const { selector, value } = props;
  const { color, sectorIds } = getSelection(state);
  return {
    isSelected: selector(state) === value,
    selectedColor: color,
    selectedSectorIds: sectorIds,
  };
};

const mapDispatchToProps = {};

const ConnectedEmojiButton = connect(mapStateToProps, mapDispatchToProps)(StyledEmojiButton);

export default ConnectedEmojiButton;
