import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStateHandlers from 'recompose/withStateHandlers';
import withProps from 'recompose/withProps';
import DoneIcon from '@material-ui/icons/Done';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import RefreshIcon from '@material-ui/icons/Refresh';
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
        Icon={DoneIcon}
        color={color}
        disabledReason={noSendReason}
        doSubmit={doSubmitSend('redpoint')}
      />
      <SubmitButton
        label="Flash&eacute;"
        Icon={FlashOnIcon}
        color={color}
        disabledReason={noSendReason}
        doSubmit={doSubmitSend('flash')}
      />
      <SubmitButton
        label="D&eacute;mont&eacute;"
        Icon={RefreshIcon}
        color={color}
        disabledReason={noClearReason}
        doSubmit={doSubmitClear}
        defaultTip="Indiquer qu'un bloc a été démonté ou réouvert depuis la dernière fois où vous l'avez enchaîné. Vous pourrez ensuite noter un passage du nouveau bloc."
      />
    </form>
  );
};

BoulderForm.defaultProps = { date: new Date().toISOString().substr(0, 10) };

const mapStateToProps = state => ({
  color: state.ui.selectedColor,
  sectors: state.ui.selectedSectors,
  sendMap: state.ui.sendMap,
});

const mapDispatchToProps = { sendBoulders, clearBoulders };

const validations = {
  anyButton({ color, sectors }) {
    if (!color) return "Sélectionner une couleur d'abord";
    if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
    return null;
  },

  sendButtons({ color, sectors, sendMap }) {
    if (some(isSent(sendMap, color), sectors)) return "La sélection contient des blocs déjà enchaînés: Désélectionnez-les ou marquez-les comme démontés d'abord";
    return null;
  },

  date({ date }) {
    const match = date.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
    if (!match) return 'Mauvais format de date: AAAA-MM-JJ';
    if (Date.parse(date) > new Date()) return 'Date future interdite';
    return null;
  },
};

// inform feedback (field disablement, tooltips) props based on form inputs
const validatedProps = (props) => {
  const sharedValidation = validations.anyButton(props);
  return {
    ...props,
    noSendReason: sharedValidation || validations.sendButtons(props),
    noClearReason: sharedValidation,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  // if we want to add states/form validation later,
  // just add handleChange to BoulderForm props
  withStateHandlers({}, {
    handleChange: () => e => (
      { [e.target.name]: e.target.value }
    ),
  }),
  withProps(validatedProps),
)(BoulderForm);
