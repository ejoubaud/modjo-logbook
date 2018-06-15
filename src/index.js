/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import createSagaMiddleware from 'redux-saga';
import WebFont from 'webfontloader';

import { showError } from './actions';
import firebase, { auth } from './firebase';
import App from './components/App';
import uiReducer from './uiReducer';
import rootSaga from './sagas';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// Load font
WebFont.load({ google: { families: ['Open Sans'] } });

// Setup redux store with firebase, redux-saga (and logger in dev)
const rootReducer = combineReducers({
  ui: uiReducer,
  firebase: firebaseReducer,
});

const sagaMiddleware = createSagaMiddleware();
const middlewares = [
  sagaMiddleware,
];

if (process.env.NODE_ENV === 'development') middlewares.push(require('redux-logger').logger); // eslint-disable-line global-require, import/newline-after-import

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, { userProfile: 'users', useFirestoreForProfile: true }),
)(createStore);

const store = createStoreWithFirebase(
  rootReducer,
  {},
  applyMiddleware(...middlewares),
);

sagaMiddleware.run(rootSaga);

// Setup global error listeners
auth.getRedirectResult().catch(e => store.dispatch(showError(e)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
