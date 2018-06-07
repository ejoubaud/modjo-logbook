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
import { createSends } from '../send';
import * as sendMapUtils from '../send-map';
import * as sendListUtils from '../send-list';
import { colorKeys as allColors } from '../colors';
import { getColorMap, getSignedInUser, getSelection, getSendMap, getSendList } from '../selectors';

promiseFinally.shim();

const saveSends = (db, { signedInUser: { uid }, sends, sendList }) => {
  // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
  const sendMapRef = db.collection('sendMaps').doc(uid);
  const sendListRef = db.collection('sendLists').doc(uid);

  const sendMap = sendMapUtils.addAll(sendMapUtils.empty, sends);
  const sendListDiff = sendListUtils.addAllDiff(sendList, sends);

  return Promise.all([
    ...sends.map(send => db.collection('sends').doc(send.id).set(send)),
    sendMapRef.set(sendMap, { merge: true }),
    sendListRef.set(sendListDiff, { merge: true }),
  ]);
};

const saveClears = (db, { signedInUser: { uid }, sectors }) => {
  // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
  const sendMapRef = db.collection('sendMaps').doc(uid);
  const clears = sectors.map(sectorId => (
    { userId: uid, sectorId, createdAt: new Date() }
  ));
  const clearCommands = sendMapUtils.populateWith(
    sendMapUtils.empty, allColors, sectors, db.FieldValue.delete(),
  );

  return Promise.all(
    clears.map(clear => db.collection('clears').add(clear)),
  ).then(() => sendMapRef.set(clearCommands, { merge: true }));
};

const sendSubmitter = props => type => () => {
  const { firestore, signedInUser, color, sectors, sendMap, sendList, sendBoulders, toggleLoading, showError, rollback } = props;
  if (signedInUser) {
    const sends = createSends({ color, type, sectorIds: sectors, userId: signedInUser.uid });
    sendBoulders(sends); // optimistic local state update
    toggleLoading(true);
    saveSends(firestore, { signedInUser, sends, sendList })
      .catch(error => rollback({ sendMap, sendList, error })) // rollback on error
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
      .catch(error => rollback({ sendMap, error })) // rollback on error
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
