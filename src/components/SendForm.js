import React from 'react';
import { connect } from 'react-redux';
import some from 'lodash/fp/some';

import LeftIcon from './LeftIcon';
import ColorButton from './ColorButton';
import { sendBoulders } from '../actions';
import { isSent as isSentIn } from '../send-map';

const RawSendForm = ({ color, sectors, canSend, sendBoulders }) => (
  <ColorButton
    color={color}
    disabled={!canSend}
    onClick={() => sendBoulders(color, sectors, { type: 'redpoint' })}
  >
    <LeftIcon icon="done" />Enchain&eacute;
  </ColorButton>
);

const mapStateToProps = (state) => {
  const color = state.ui.selectedColor;
  const sectors = state.ui.selectedSectors;
  return {
    color,
    sectors,
    canSend: color && sectors.length > 0 && !some(isSentIn(state.ui.sendMap, color), sectors),
  };
};

const mapDispatchToProps = { sendBoulders };

export default connect(mapStateToProps, mapDispatchToProps)(RawSendForm);
