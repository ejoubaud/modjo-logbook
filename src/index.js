/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import 'muicss/dist/css/mui.css';

import App from './App';
import uiReducer from './ui-reducer';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// Setup redux store
const rootReducer = combineReducers({ ui: uiReducer });
const initialState = {};
const store = createStore(rootReducer, initialState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
