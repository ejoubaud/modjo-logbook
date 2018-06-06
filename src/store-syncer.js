// keeps the part of the Redux store up-to-date with
// a Firestore doc by triggering a sync action on snapshot
import map from 'lodash/fp/map';
import promiseFinally from 'promise.prototype.finally';

import { showError, toggleLoading } from './actions';

promiseFinally.shim();

const createSyncer = (store) => {
  let configs = [];
  let unsubscribes = [];

  const sync = ({
    docRef, syncActionCreator, stateGetter, syncMessage,
    collectionMethods: { isEmpty, isEquivalent },
  }) => (
    new Promise((resolve) => {
      const unsubscribe = docRef.onSnapshot((doc) => {
        const newDoc = doc.data();
        resolve(newDoc); // first load only
        if (doc.exists) {
          const oldDoc = stateGetter(store.getState());
          if (!isEquivalent(newDoc, oldDoc)) {
            store.dispatch(syncActionCreator(newDoc));
            if (!isEmpty(oldDoc)) store.dispatch(showError(syncMessage));
          }
        }
      });
      unsubscribes.push(unsubscribe);
    })
  );

  const syncAll = (...syncerConfigs) => {
    configs = syncerConfigs;
    store.dispatch(toggleLoading(true));

    const whenStartedPromises = map(sync, syncerConfigs);
    const whenAllStarted = Promise.all(whenStartedPromises);

    whenAllStarted
      .catch(err => store.dispatch(showError(err)))
      .finally(() => store.dispatch(toggleLoading(false)));
  };

  // unsubscribe to snapshot and empty all synced collections
  const stopAll = () => {
    map(fn => fn(), unsubscribes);
    unsubscribes = [];
    map(({ syncActionCreator, collectionMethods: { empty } }) => {
      store.dispatch(syncActionCreator(empty));
    }, configs);
    configs = [];
  };

  return { syncAll, stopAll };
};

export default createSyncer;
