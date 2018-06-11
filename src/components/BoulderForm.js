import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import withState from 'recompose/withState';
import withStateHandlers from 'recompose/withStateHandlers';
import DoneIcon from '@material-ui/icons/Done';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import RefreshIcon from '@material-ui/icons/Refresh';
import promiseFinally from 'promise.prototype.finally';
import some from 'lodash/fp/some';

import SubmitButton from './SubmitButton';
import ConfirmDialog from './ConfirmDialog';
import ToggleAllSectors from './ToggleAllSectors';
import { submitSends, submitClears } from '../actions';
import { getColorMap, getSignedInUser, getSelection, getSendMap, getSendList } from '../selectors';
import * as sendMapUtils from '../sendMap';

promiseFinally.shim();

const validations = {
  sendButtons({ color, sectors, sendMap }) {
    if (!color) return "Sélectionner une couleur d'abord";
    if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
    if (some(sendMapUtils.isSent(sendMap, color), sectors)) {
      return "La sélection contient des blocs déjà enchaînés: Désélectionnez-les ou marquez-les comme démontés d'abord";
    }
    return null;
  },

  clearButton({ color, sectors, sendMap, isColorMapMode, colorMap }) {
    if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
    const unsentMessage = "La sélection contient des blocs non-enchaînés, pas besoin de les démonter: Désélectionnez-les ou marquez-les comme enchaînés d'abord";
    if (isColorMapMode) {
      const sentInColor = some(sectorId => !colorMap[sectorId], sectors);
      if (sentInColor) return unsentMessage;
    } else {
      const sentInThisColor = some(sector => !sendMapUtils.isSent(sendMap, color, sector), sectors);
      if (sentInThisColor) return unsentMessage;
    }
    return null;
  },

  date({ date }) {
    const match = date.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
    if (!match) return 'Mauvais format de date: AAAA-MM-JJ';
    if (Date.parse(date) > new Date()) return 'Date future interdite';
    return null;
  },
};

const BoulderForm = (props) => {
  const { color, isColorMapMode, isConfirmOpen, toggleConfirm, submitSends, submitClears } = props;

  const noSendReason = validations.sendButtons(props);
  const noClearReason = validations.clearButton(props);

  return (
    <form>
      <SubmitButton
        label="Encha&icirc;n&eacute;"
        Icon={DoneIcon}
        color={color}
        disabledReason={noSendReason}
        doSubmit={() => submitSends('redpoint')}
      />
      <SubmitButton
        label="Flash&eacute;"
        Icon={FlashOnIcon}
        color={color}
        disabledReason={noSendReason}
        doSubmit={() => submitSends('flash')}
      />
      <SubmitButton
        label="D&eacute;mont&eacute;"
        Icon={RefreshIcon}
        color={color}
        disabledReason={noClearReason}
        doSubmit={() => (isColorMapMode ? submitClears() : toggleConfirm(true))}
        defaultTip="Indiquer qu'un bloc a été démonté ou réouvert depuis la dernière fois où vous l'avez enchaîné. Vous pourrez ensuite noter un passage du nouveau bloc."
      />
      <ToggleAllSectors />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        toggleConfirm={toggleConfirm}
        onConfirm={submitClears}
      />
    </form>
  );
};

BoulderForm.defaultProps = { date: new Date().toISOString().substr(0, 10) };

const mapStateToProps = (state) => {
  const { color, sectorIds } = getSelection(state);
  return {
    color,
    sectors: sectorIds,
    sendMap: getSendMap(state),
    sendList: getSendList(state),
    isColorMapMode: !color,
    colorMap: getColorMap(state),
    signedInUser: getSignedInUser(state),
  };
};

const mapDispatchToProps = { submitSends, submitClears };

export default compose(
  withState('isConfirmOpen', 'toggleConfirm', false),
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps),
  // if we want to add states/form validation later,
  // just add handleChange to BoulderForm props
  withStateHandlers({}, {
    handleChange: () => e => (
      { [e.target.name]: e.target.value }
    ),
  }),
)(BoulderForm);
