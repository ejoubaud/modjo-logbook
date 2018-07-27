/* global window */
/* eslint global-require: off */
import capitalize from 'lodash/fp/capitalize';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Setup firebase
if (process.env.NODE_ENV === 'development') {
  const config = require('./config/firebase.dev.json');
  console.log('config', config);
  firebase.initializeApp(config);
  window.firebase = firebase;
} else {
  const config = require('./config/firebase.prod.json');
  firebase.initializeApp(config);
}

// Setup firestore
firebase.firestore().settings({
  timestampsInSnapshots: true,
});

export default firebase;
export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const getProviderForProviderId = id => (
  firebase.auth[`${capitalize(id.replace(/\.[a-z]+$/, ''))}AuthProvider`]
);

export const deletionMarker = firebase.firestore.FieldValue.delete();
export const docRef = (collection, docId) => firestore.collection(collection).doc(docId);
