import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import withStateHandlers from 'recompose/withStateHandlers';
import DoneIcon from '@material-ui/icons/Done';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import RefreshIcon from '@material-ui/icons/Refresh';
import promiseFinally from 'promise.prototype.finally';
import some from 'lodash/fp/some';

import SubmitButton from './SubmitButton';
import { sendBoulders, clearBoulders, showError, toggleLoading, rollback } from '../actions';
import { empty as emptySendMap, isSent, addAll, populateWith } from '../send-map';

promiseFinally.shim();

const saveSends = (db, { userId, color, sectors, type }) => {
  // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
  const sendMapRef = db.collection('sendMaps').doc(userId);
  const sends = sectors.map(sectorId => (
    { userId, color, sectorId, type, createdAt: new Date() }
  ));
  const sendMap = addAll(emptySendMap, sends);

  return Promise.all(
    sends.map(send => db.collection('sends').add(send)),
  ).then(() => sendMapRef.set(sendMap, { merge: true }));
};

const saveClears = (db, { userId, color, sectors }) => {
  // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
  const sendMapRef = db.collection('sendMaps').doc(userId);
  const clears = sectors.map(sectorId => (
    { userId, color, sectorId, createdAt: new Date() }
  ));
  const clearCommands = populateWith(emptySendMap, clears, db.FieldValue.delete());

  return Promise.all(
    clears.map(clear => db.collection('clears').add(clear)),
  ).then(() => sendMapRef.set(clearCommands, { merge: true }));
};

const sendSubmitter = props => type => () => {
  const { firestore, signedInUser, color, sectors, sendMap, sendBoulders, toggleLoading, showError, rollback } = props;
  if (signedInUser) {
    sendBoulders(color, sectors, { type }); // optimistic local state update
    toggleLoading(true);
    saveSends(firestore, { userId: signedInUser.uid, color, sectors, type }, showError)
      .catch(err => rollback(sendMap, err)) // rollback on error
      .finally(() => toggleLoading(false));
  } else {
    sendBoulders(color, sectors, { type });
    showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' });
  }
};

const clearSubmitter = props => () => {
  const { firestore, signedInUser, color, sectors, sendMap, clearBoulders, toggleLoading, showError, rollback } = props;
  if (signedInUser) {
    clearBoulders(color, sectors); // optimistic local state update
    toggleLoading(true);
    saveClears(firestore, { userId: signedInUser.uid, color, sectors }, showError)
      .catch(err => rollback(sendMap, err)) // rollback on error
      .finally(() => toggleLoading(false));
  } else {
    clearBoulders(color, sectors);
    showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' });
  }
};

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

const BoulderForm = (props) => {
  const { color } = props;

  const sharedValidation = validations.anyButton(props);
  const noSendReason = sharedValidation || validations.sendButtons(props);
  const noClearReason = sharedValidation;

  const doSubmitClear = clearSubmitter(props);
  const doSubmitSends = sendSubmitter(props);

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
        doSubmit={doSubmitClear}
        defaultTip="Indiquer qu'un bloc a été démonté ou réouvert depuis la dernière fois où vous l'avez enchaîné. Vous pourrez ensuite noter un passage du nouveau bloc."
      />
    </form>
  );
};

BoulderForm.defaultProps = { date: new Date().toISOString().substr(0, 10) };

const mapStateToProps = ({
  ui: { selectedColor, selectedSectors, sendMap },
  firebase: { auth },
}) => ({
  color: selectedColor,
  sectors: selectedSectors,
  sendMap,
  signedInUser: !auth.isEmpty && auth,
});

const mapDispatchToProps = { sendBoulders, clearBoulders, showError, rollback, toggleLoading };

export default compose(
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
