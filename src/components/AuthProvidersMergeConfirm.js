import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import ConfirmDialog from './ConfirmDialog';
import { getProvidersForMerge } from '../selectors';
import { toggleAuthProviderMerge } from '../actions';

const AuthProvidersMergeConfirm = ({ firebase, providersForMerge, toggleAuthProviderMerge }) => {
  const { targetProviderId, existingProviderId, email } = providersForMerge || {};
  return (
    <ConfirmDialog
      title="Connexion &agrave; un compte existant par un nouveau fournisseur"
      isOpen={!!providersForMerge}
      toggleConfirm={() => toggleAuthProviderMerge(null)}
      onConfirm={() => firebase.login({ provider: existingProviderId.replace(/\.[a-z]+$/, '') })}
    >
      Vous essayez de vous connecter avec {targetProviderId} mais
      votre adresse email {email} est d&eacute;j&agrave;
      enregistr&eacute;e avec {existingProviderId}.
      <br /><br />
      Pour relier les deux connexions, vous allez &ecirc;tre
      d&apos;abord renvoy&eacute; vers {existingProviderId} pour
      vous reconnecter et confirmer votre identit&eacute;.
      <br /><br />
      Poursuivre?
    </ConfirmDialog>
  );
};

const mapStateToProps = state => ({
  providersForMerge: getProvidersForMerge(state),
});

const mapDispatchToProps = { toggleAuthProviderMerge };

const ConnectedAuthProvidersMergeConfirm = compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
)(AuthProvidersMergeConfirm);

export default ConnectedAuthProvidersMergeConfirm;
