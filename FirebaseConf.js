// Importa las funciones necesarias de los SDKs de Firebase que uses
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

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
// Inicializa Firebase.
const app = initializeApp(FirebaseConf);

// Inicializa Firebase Auth con persistencia
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
// Si exportabas 'firebase' antes y lo necesitas, puedes exportar 'app'
export default app;