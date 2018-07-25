import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withState from 'recompose/withState';
import withStateHandlers from 'recompose/withStateHandlers';
import DoneIcon from '@material-ui/icons/Done';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import RefreshIcon from '@material-ui/icons/Refresh';
import promiseFinally from 'promise.prototype.finally';
import some from 'lodash/fp/some';

import SubmitButton from './SubmitButton';
import ConfirmDialog from './ConfirmDialog';
import ToggleSectorMultiSelect from './ToggleSectorMultiSelect';
import RatingFields from './RatingFields';
import { submitSends, submitClears } from '../actions';
import { getColorMap, getSelection, getSendMap, getSendList } from '../selectors';
import * as sendMapUtils from '../collections/sendMap';

promiseFinally.shim();

const validations = {
  sendButtons({ color, sectors, sendMap }) {
    if (!color) return "Sélectionner une couleur d'abord";
    if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
    if (some(sendMapUtils.isSent(sendMap, color), sectors)) {
      return "La sélection contient des blocs déjà validés: Désélectionnez-les ou marquez-les comme démontés d'abord";
    }
    return null;
  },

  clearButton({ color, sectors, sendMap, isColorMapMode, colorMap }) {
    if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
    const unsentMessage = "La sélection contient des blocs non-validés, pas besoin de les démonter: Désélectionnez-les ou marquez-les comme validés d'abord";
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

const DefaultSendTooltip = () => (
  <Fragment>
    Marquer le(s) bloc(s) commes valid&eacute;(s):<br />
    encha&icirc;n&eacute;(s) de la position de d&eacute;part jusqu&apos;&agrave;<br />
    tenir la derni&egrave;re prise &agrave; 2 mains ou au r&eacute;ta final,<br />
    sans interruption
  </Fragment>
);

const DefaultFlashTooltip = () => (
  <Fragment>
    Marquer le(s) bloc(s) comme flash&eacute;(s):<br />
    valid&eacute;(s) au tout premier essai
  </Fragment>
);

const DefaultClearTooltip = () => (
  <Fragment>
    Indiquer qu&apos;un bloc a &eacute;t&eacute; d&eacute;mont&eacute; ou r&eacute;ouvert<br />
    depuis la derni&egrave;re fois o&ugrave; vous l&apos;avez valid&eacute;.<br />
    Vous pourrez ensuite noter un passage du nouveau bloc.
  </Fragment>
);

const BoulderForm = (props) => {
  const {
    color,
    isColorMapMode,
    isConfirmOpen,
    toggleConfirm,
    submitSends,
    submitClears,
  } = props;

  const noSendReason = validations.sendButtons(props);
  const noClearReason = validations.clearButton(props);

  return (
    <form>
      <RatingFields noSendReason={noSendReason} />

      <div>
        <SubmitButton
          label="Validé"
          Icon={DoneIcon}
          color={color}
          disabledReason={noSendReason}
          doSubmit={() => submitSends('redpoint')}
          defaultTip={<DefaultSendTooltip />}
        />

        <SubmitButton
          label="Flash&eacute;"
          Icon={FlashOnIcon}
          color={color}
          disabledReason={noSendReason}
          doSubmit={() => submitSends('flash')}
          defaultTip={<DefaultFlashTooltip />}
        />

        <SubmitButton
          label="D&eacute;mont&eacute;"
          Icon={RefreshIcon}
          color={color}
          disabledReason={noClearReason}
          doSubmit={() => (isColorMapMode ? submitClears() : toggleConfirm(true))}
          defaultTip={<DefaultClearTooltip />}
        />

        <ToggleSectorMultiSelect />
      </div>

      <ConfirmDialog
        title="Toutes les couleurs seront démontées"
        isOpen={isConfirmOpen}
        toggleConfirm={toggleConfirm}
        onConfirm={submitClears}
      >
        Le d&eacute;montage concerne un secteur entier, pas seulement cette couleur.
        Les blocs de toutes les couleurs seront marqu&eacute;es comme d&eacute;mont&eacute;s
        pour les secteurs s&eacute;lectionn&eacute;s. Continuer&nbsp;?
      </ConfirmDialog>
    </form>
  );
};

const mapStateToProps = (state) => {
  const { color, sectorIds } = getSelection(state);
  return {
    color,
    sectors: sectorIds,
    sendMap: getSendMap(state),
    sendList: getSendList(state),
    isColorMapMode: !color,
    colorMap: getColorMap(state),
  };
};

const mapDispatchToProps = { submitSends, submitClears };

export default compose(
  withState('isConfirmOpen', 'toggleConfirm', false),
  connect(mapStateToProps, mapDispatchToProps),
  // if we want to add states/form validation later,
  // just add handleChange to BoulderForm props
  withStateHandlers({}, {
    handleChange: () => e => (
      { [e.target.name]: e.target.value }
    ),
  }),
)(BoulderForm);
