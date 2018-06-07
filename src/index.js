/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import createSagaMiddleware from 'redux-saga';

import { showError, syncSendMap, syncSendList } from './actions';
import * as sendMap from './sendMap';
import * as sendList from './sendList';
import firebase, { auth, firestore } from './firebase';
import App from './components/App';
import uiReducer from './uiReducer';
import rootSaga from './sagas';
import { getSendMap, getSendList } from './selectors';
import createStoreSyncer from './storeSyncer';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// Setup redux store with firebase, redux-saga (and logger in dev)
const rootReducer = combineReducers({
  ui: uiReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const sagaMiddleware = createSagaMiddleware();
const middlewares = [
  sagaMiddleware,
];

if (process.env.NODE_ENV === 'development') middlewares.push(require('redux-logger').logger); // eslint-disable-line global-require, import/newline-after-import

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, { userProfile: 'users', useFirestoreForProfile: true }),
  reduxFirestore(firebase),
)(createStore);

const store = createStoreWithFirebase(
  rootReducer,
  {},
  applyMiddleware(...middlewares),
);

sagaMiddleware.run(rootSaga);

// Setup global error listeners
auth.getRedirectResult().catch(e => store.dispatch(showError(e)));


// Setup sendMap and sendList listener
const syncer = createStoreSyncer(store);
auth.onAuthStateChanged((user) => {
  if (user) {
    syncer.syncAll({
      docRef: firestore.collection('sendMaps').doc(user.uid),
      syncActionCreator: syncSendMap,
      stateGetter: getSendMap,
      collectionMethods: sendMap,
      syncMessage: 'Carte des blocs synchronisée depuis le serveur',
    }, {
      docRef: firestore.collection('sendLists').doc(user.uid),
      syncActionCreator: syncSendList,
      stateGetter: getSendList,
      collectionMethods: sendList,
      syncMessage: 'Liste de blocs enchaînés synchronisée depuis le serveur',
    });
  } else {
    syncer.stopAll();
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
