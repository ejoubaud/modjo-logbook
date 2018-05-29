/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';

import firebase from './firebase';
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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
