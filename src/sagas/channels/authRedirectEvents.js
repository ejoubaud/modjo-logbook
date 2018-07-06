/* global window */
import { put, call } from 'redux-saga/effects';

import { auth, getProviderForProviderId } from '../../firebase';
import { toggleAuthProviderMerge, showError } from '../../actions';

const pendingProviderMergeKey = 'modjoLogbookFirebasePendingCredential';
const noSessionStorageMsg = `
Vous essayer de vous connecter avec un nouveau fournisseur
pour un compte existant et votre navigateur n'a pas la
fonctionalité 'sessionStorage'. L'application doit relier
les deux connexions, mais elle ne peut le faire que sur les
navigateurs supportant 'sessionStorage'. Utilisez un
navigateur moderne pour relier les 2 connexions ou activez
'sessionStorage'.
`;

const clearStorage = () => (
  window.sessionStorage && window.sessionStorage.removeItem(pendingProviderMergeKey)
);

function* startProviderMerge(err) {
  if (window.sessionStorage) {
    const { credential, email } = err;
    const methods = yield call([auth, 'fetchSignInMethodsForEmail'], email);
    const existingProviderId = methods[0];
    window.sessionStorage.setItem(
      pendingProviderMergeKey,
      JSON.stringify({ email, existingProviderId, pendingCredential: credential }),
    );
    const targetProviderId = credential.providerId;
    yield put(toggleAuthProviderMerge({ targetProviderId, existingProviderId, email }));
  } else {
    yield put(showError(noSessionStorageMsg));
  }
}

function* handleError(err) {
  if (err.code === 'auth/account-exists-with-different-credential') {
    yield call(startProviderMerge, err);
  } else {
    yield put(showError(`Error ${err.code}: ${err.message}`));
  }
}

function* finishProviderMerge(res, pendingProviderMerge) {
  const { operationType, additionalUserInfo, user } = res;
  if (operationType !== 'signIn' || !additionalUserInfo) return;

  const { isNewUser, providerId } = additionalUserInfo;
  const { email, existingProviderId, pendingCredential } = JSON.parse(pendingProviderMerge);

  if (!user || isNewUser || email !== user.email || existingProviderId !== providerId) return;

  const provider = getProviderForProviderId(pendingCredential.providerId);
  yield call([user, 'linkAndRetrieveDataWithCredential'], provider.credential(pendingCredential));
}

function* handleSuccess(res) {
  if (res && window.sessionStorage) {
    const pendingProviderMerge = window.sessionStorage.getItem(pendingProviderMergeKey);
    if (pendingProviderMerge) yield call(finishProviderMerge, res, pendingProviderMerge);
  }
}

export default function* start() {
  try {
    const res = yield call([auth, 'getRedirectResult']);
    yield call(handleSuccess, res);
    clearStorage();
  } catch (error) {
    clearStorage();
    yield call(handleError, error);
  }
}
