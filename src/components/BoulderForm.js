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
import { sendBoulders, clearSectors, showError, toggleLoading, rollback } from '../actions';
import { empty as emptySendMap, isSent, addAll, populateWith } from '../send-map';
import { colorKeys as allColors } from '../colors';
import { getColorMap } from '../selectors';

promiseFinally.shim();

const saveSends = (db, { signedInUser: { uid }, color, sectors, type }) => {
  // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
  const sendMapRef = db.collection('sendMaps').doc(uid);
  const sends = sectors.map(sectorId => (
    { uid, color, sectorId, type, createdAt: new Date() }
  ));
  const sendMap = addAll(emptySendMap, sends);

  return Promise.all(
    sends.map(send => db.collection('sends').add(send)),
  ).then(() => sendMapRef.set(sendMap, { merge: true }));
};

const saveClears = (db, { signedInUser: { uid }, sectors }) => {
  // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
  const sendMapRef = db.collection('sendMaps').doc(uid);
  const clears = sectors.map(sectorId => (
    { userId: uid, sectorId, createdAt: new Date() }
  ));
  const clearCommands = populateWith(emptySendMap, allColors, sectors, db.FieldValue.delete());

  return Promise.all(
    clears.map(clear => db.collection('clears').add(clear)),
  ).then(() => sendMapRef.set(clearCommands, { merge: true }));
};

const sendSubmitter = props => type => () => {
  const { firestore, signedInUser, color, sectors, sendMap, sendBoulders, toggleLoading, showError, rollback } = props;
  if (signedInUser) {
    sendBoulders(color, sectors, { type }); // optimistic local state update
    toggleLoading(true);
    saveSends(firestore, { signedInUser, color, sectors, type })
      .catch(err => rollback(sendMap, err)) // rollback on error
      .finally(() => toggleLoading(false));
  } else {
    sendBoulders(color, sectors, { type });
    showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' });
  }
};

const clearSubmitter = props => () => {
  const { firestore, signedInUser, sectors, sendMap, clearSectors, toggleLoading, showError, rollback } = props;
  if (signedInUser) {
    clearSectors(sectors); // optimistic local state update
    toggleLoading(true);
    saveClears(firestore, { signedInUser, sectors })
      .catch(err => rollback(sendMap, err)) // rollback on error
      .finally(() => toggleLoading(false));
  } else {
    clearSectors(sectors);
    showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' });
  }
};

const validations = {
  sendButtons({ color, sectors, sendMap }) {
    if (!color) return "Sélectionner une couleur d'abord";
    if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
    if (some(isSent(sendMap, color), sectors)) return "La sélection contient des blocs déjà enchaînés: Désélectionnez-les ou marquez-les comme démontés d'abord";
    return null;
  },

  clearButton({ color, sectors, sendMap, isColorMapMode, colorMap }) {
    if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
    const unsentMessage = "La sélection contient des blocs non-enchaînés, pas besoin de les démonter: Désélectionnez-les ou marquez-les comme enchaînés d'abord";
    if (isColorMapMode) {
      const sentInColor = some(sectorId => !colorMap[sectorId], sectors);
      if (sentInColor) return unsentMessage;
    } else {
      const sentInThisColor = (some(sector => !isSent(sendMap, color, sector), sectors));
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
  const { color, isColorMapMode } = props;

  const noSendReason = validations.sendButtons(props);
  const noClearReason = validations.clearButton(props);

  const doSubmitClear = clearSubmitter(props);
  const doSubmitSends = sendSubmitter(props);

  const { isConfirmOpen, toggleConfirm } = props;

  return (
    <form>
      <SubmitButton
        label="Encha&icirc;n&eacute;"
        Icon={DoneIcon}
        color={color}
        disabledReason={noSendReason}
        doSubmit={doSubmitSends('redpoint')}
      />
      <SubmitButton
        label="Flash&eacute;"
        Icon={FlashOnIcon}
        color={color}
        disabledReason={noSendReason}
        doSubmit={doSubmitSends('flash')}
      />
      <SubmitButton
        label="D&eacute;mont&eacute;"
        Icon={RefreshIcon}
        color={color}
        disabledReason={noClearReason}
        doSubmit={() => (isColorMapMode ? doSubmitClear() : toggleConfirm(true))}
        defaultTip="Indiquer qu'un bloc a été démonté ou réouvert depuis la dernière fois où vous l'avez enchaîné. Vous pourrez ensuite noter un passage du nouveau bloc."
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        toggleConfirm={toggleConfirm}
        onConfirm={doSubmitClear}
      />
    </form>
  );
};

BoulderForm.defaultProps = { date: new Date().toISOString().substr(0, 10) };

const mapStateToProps = (state) => {
  const {
    ui: { selectedColor, selectedSectors, sendMap },
    firebase: { auth },
  } = state;
  return {
    color: selectedColor,
    sectors: selectedSectors,
    sendMap,
    isColorMapMode: !selectedColor,
    colorMap: getColorMap(state),
    signedInUser: !auth.isEmpty && auth,
  };
};

const mapDispatchToProps = { sendBoulders, clearSectors, showError, rollback, toggleLoading };

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
