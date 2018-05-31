import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Setup firebase
firebase.initializeApp({
  apiKey: 'AIzaSyAW4FfrqI-zc3L1DSTqC79dX_VuvBC2UjE',
  authDomain: 'modjo-logbook.firebaseapp.com',
  databaseURL: 'https://modjo-logbook.firebaseio.com',
  projectId: 'modjo-logbook',
  storageBucket: 'modjo-logbook.appspot.com',
  messagingSenderId: '1098715116304',
});

// Setup firestore
firebase.firestore().settings({
  timestampsInSnapshots: true,
});

export default firebase;
export const firestore = firebase.firestore();
export const auth = firebase.auth();
