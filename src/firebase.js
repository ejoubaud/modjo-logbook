import firebase from 'firebase/app';
import 'firebase/auth';

// Setup firebase
firebase.initializeApp({
  apiKey: 'AIzaSyAW4FfrqI-zc3L1DSTqC79dX_VuvBC2UjE',
  authDomain: 'modjo-logbook.firebaseapp.com',
  databaseURL: 'https://modjo-logbook.firebaseio.com',
  projectId: 'modjo-logbook',
  storageBucket: 'modjo-logbook.appspot.com',
  messagingSenderId: '1098715116304',
});

export default firebase;
