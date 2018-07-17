/* global window */
import capitalize from 'lodash/fp/capitalize';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Setup firebase
if (process.env.NODE_ENV === 'development') {
  firebase.initializeApp({
    apiKey: 'AIzaSyBZcVNjFvytEL-fnAxJKXLM49W63nhz_jI',
    authDomain: 'modjo-logbook-dev.firebaseapp.com',
    databaseURL: 'https://modjo-logbook-dev.firebaseio.com',
    projectId: 'modjo-logbook-dev',
    storageBucket: 'modjo-logbook-dev.appspot.com',
    messagingSenderId: '165501549583',
  });
} else {
  firebase.initializeApp({
    apiKey: 'AIzaSyAW4FfrqI-zc3L1DSTqC79dX_VuvBC2UjE',
    authDomain: 'modjo-logbook.firebaseapp.com',
    databaseURL: 'https://modjo-logbook.firebaseio.com',
    projectId: 'modjo-logbook',
    storageBucket: 'modjo-logbook.appspot.com',
    messagingSenderId: '1098715116304',
  });
  window.firebase = firebase;
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
