/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import 'muicss/dist/css/mui.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
