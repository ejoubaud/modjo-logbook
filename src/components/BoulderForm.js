import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';
import some from 'lodash/fp/some';

import SubmitButton from './SubmitButton';
import { sendBoulders, clearBoulders } from '../actions';
import { isSent } from '../send-map';

const BoulderForm = ({
  color,
  sectors,
  noSendReason,
  noClearReason,
  sendBoulders,
  clearBoulders,
}) => {
  const doSubmitSend = type => () => sendBoulders(color, sectors, { type });
  const doSubmitClear = () => clearBoulders(color, sectors);

  return (
    <form>
      <SubmitButton
        label="Encha&icirc;n&eacute;"
        icon="done"
        color={color}
        disabledReason={noSendReason}
        doSubmit={doSubmitSend('redpoint')}
      />
      <SubmitButton
        label="Flash&eacute;"
        icon="flash_on"
        color={color}
        disabledReason={noSendReason}
        doSubmit={doSubmitSend('flash')}
      />
      <SubmitButton
        label="D&eacute;mont&eacute;"
        icon="refresh"
        color={color}
        disabledReason={noClearReason}
        doSubmit={doSubmitClear}
        defaultTip="Indiquer qu'un bloc a &eacute;t&eacute; d&eacute;mont&eacute; ou r&eacute;ouvert depuis la derni&egrave;re fois o&ugrave; vous l'avez encha&icirc;n&eacute;.<br />Vous pourrez ensuite noter un passage du nouveau bloc."
      />
    </form>
  );
};

const mapStateToProps = state => ({
  color: state.ui.selectedColor,
  sectors: state.ui.selectedSectors,
  sendMap: state.ui.sendMap,
});

const mapDispatchToProps = { sendBoulders, clearBoulders };

const validations = {
  anyButton({ color, sectors }) {
    if (!color) return "S&eacute;lectionner une couleur d'abord";
    if (sectors.length === 0) return "S&eacute;lectionner des secteurs d'abord";
    return null;
  },

  sendButtons({ color, sectors, sendMap }) {
    if (some(isSent(sendMap, color), sectors)) return "La s&eacute;lection contient des blocs d&eacute;j&agrave; encha&icirc;n&eacute;s<br />D&eacute;s&eacute;lectionnez-les ou marquez-les comme d&eacute;mont&eacute;s d'abord";
    return null;
  },
};

// inform feedback (field disablement, tooltips) props based on form inputs
const validationProps = (props) => {
  const sharedValidation = validations.anyButton(props);
  return {
    ...props,
    noSendReason: sharedValidation || validations.sendButtons(props),
    noClearReason: sharedValidation,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({ handleChange: props => e => ({ ...props, [e.target.name]: e.target.value }) }),
  withProps(validationProps),
)(BoulderForm);
