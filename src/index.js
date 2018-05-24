/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import 'muicss/dist/css/mui.css';

import './firebase';
import App from './components/App';
import uiReducer from './ui-reducer';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

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
