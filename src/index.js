/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import 'muicss/dist/css/mui.css';

import App from './components/App';
import uiReducer from './ui-reducer';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

firebase.initializeApp({
  apiKey: 'AIzaSyAW4FfrqI-zc3L1DSTqC79dX_VuvBC2UjE',
  authDomain: 'modjo-logbook.firebaseapp.com',
  databaseURL: 'https://modjo-logbook.firebaseio.com',
  projectId: 'modjo-logbook',
  storageBucket: 'modjo-logbook.appspot.com',
  messagingSenderId: '1098715116304',
});

// Setup redux store
const rootReducer = combineReducers({ ui: uiReducer });
const middlewares = [];
if (process.env.NODE_ENV === 'development') middlewares.push(require('redux-logger').logger); // eslint-disable-line global-require, import/newline-after-import
const store = createStore(rootReducer, applyMiddleware(...middlewares));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
