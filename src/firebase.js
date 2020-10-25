import firebase from 'firebase';
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBxIff2Y2UhpLNG-_6SwQap_r0wCotLqjI",
    authDomain: "instagram-clone-cc2fd.firebaseapp.com",
    databaseURL: "https://instagram-clone-cc2fd.firebaseio.com",
    projectId: "instagram-clone-cc2fd",
    storageBucket: "instagram-clone-cc2fd.appspot.com",
    messagingSenderId: "1044697342605",
    appId: "1:1044697342605:web:886df39cfcb39f7713b8c4",
    measurementId: "G-CCS8VBJR2J"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db= firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
