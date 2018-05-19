import React from 'react';
import { connect } from 'react-redux';
import some from 'lodash/fp/some';

import LeftIcon from './LeftIcon';
import ColorButton from './ColorButton';
import { sendBoulders } from '../actions';
import { isSent as isSentIn } from '../send-map';

const disabledReason = (color, sectors) => {
  if (!color) return "Sélectionner une couleur d'abord";
  if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
  return "La sélection contient des blocs déjà enchaîné, les désélectionner ou les marquer comme démontés d'abord";
};

const onClick = ({ canSend, color, sectors, sendBoulders }) => (
  (e) => {
    e.preventDefault();
    if (canSend) sendBoulders(color, sectors, { type: 'redpoint' });
  }
);

const RawSendButton = ({ color, sectors, canSend, sendBoulders }) => (
  <ColorButton
    color={color}
    className={canSend || 'mui--is-disabled'}
    onClick={onClick({ canSend, color, sectors, sendBoulders })}
    data-tip={disabledReason(color, sectors)}
    data-tip-disable={canSend}
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
    canSend: !!color && sectors.length > 0 && !some(isSentIn(state.ui.sendMap, color), sectors),
  };
};

const mapDispatchToProps = { sendBoulders };

export default connect(mapStateToProps, mapDispatchToProps)(RawSendButton);
