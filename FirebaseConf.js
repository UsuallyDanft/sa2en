import firebase from "firebase"

const FirebaseConf = {
  apiKey: "AIzaSyArr-DeYgLxsVOdUa_Z4nZyD7W_J5EKdfU",
  authDomain: "caja-chica-app-abaa0.firebaseapp.com",
  projectId: "caja-chica-app-abaa0",
  storageBucket: "caja-chica-app-abba0.appspot.com",
  messagingSenderId: "201937593149",
  appId: "1:201937593149:web:1caf1f808f84738ed8db54",
  measurementId: "G-218QCCLFC2"
};

// Inicializar Firebase 
if (!firebase.apps.length) {
  firebase.initializeApp(FirebaseConf)
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;

