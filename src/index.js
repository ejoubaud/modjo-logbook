/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import { showError, syncSendMap } from './actions';

import firebase, { auth, firestore } from './firebase';
import App from './components/App';
import uiReducer from './ui-reducer';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// Setup redux store with firebase (and logger in dev)
const rootReducer = combineReducers({
  ui: uiReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const middlewares = [];
if (process.env.NODE_ENV === 'development') middlewares.push(require('redux-logger').logger); // eslint-disable-line global-require, import/newline-after-import

const store = createStore(
  rootReducer,
  compose(
    reactReduxFirebase(firebase, { userProfile: 'users', useFirestoreForProfile: true }),
    reduxFirestore(firebase),
    applyMiddleware(...middlewares),
  ),
);

// Setup global error listeners
auth.getRedirectResult().catch(e => store.dispatch(showError(e)));

// Setup sendMap listener
auth.onAuthStateChanged((user) => {
  if (user) {
    firestore.collection('sendMaps').doc(user.uid).onSnapshot((sendMap) => {
      if (sendMap.exists) {
        const newSendMap = sendMap.data();
        store.dispatch(syncSendMap(newSendMap));
        store.dispatch(showError('Nouveaux blocs synchronisés depuis le serveur'));
      }
    });
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
