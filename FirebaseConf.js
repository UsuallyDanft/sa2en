// Importa las funciones necesarias de los SDKs de Firebase que uses
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence, // Para nativo
  browserLocalPersistence      // Para la web
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native'; // Importante para detectar la plataforma

const FirebaseConf = {
  apiKey: "AIzaSyArr-DeYgLxsVOdUa_Z4nZyD7W_J5EKdfU",
  authDomain: "caja-chica-app-abaa0.firebaseapp.com",
  projectId: "caja-chica-app-abaa0",
  storageBucket: "caja-chica-app-abaa0.appspot.com", // Corregí una 'b' extra aquí
  messagingSenderId: "201937593149",
  appId: "1:201937593149:web:1caf1f808f84738ed8db54",
  measurementId: "G-218QCCLFC2"
};

// Inicializar Firebase 
const app = initializeApp(FirebaseConf);

// Inicializa Firebase Auth con persistencia condicional
export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web'
    ? browserLocalPersistence // Usa esta si estás en la web
    : getReactNativePersistence(ReactNativeAsyncStorage) // Usa esta para iOS/Android
});

// Inicializa otros servicios de Firebase que necesites
export const db = getFirestore(app);

// Si exportabas 'firebase' antes y lo necesitas, puedes exportar 'app'
export default app;