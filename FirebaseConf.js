// Importa las funciones necesarias de los SDKs de Firebase que uses
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence, // Para nativo
  browserLocalPersistence   // Para la web
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native'; // Importante para detectar la plataforma

// Datos extraídos del JSON proporcionado
const FirebaseConf = {
  apiKey: "AIzaSyCt9L4LzFJK2icufGt0HYiuGwhgKxhM7v0",
  authDomain: "sa2en-app.firebaseapp.com",
  projectId: "sa2en-app",
  storageBucket: "sa2en-app.appspot.com", // O "sa2en-app.firebasestorage.app"
  messagingSenderId: "493790722792",
  appId: "1:493790722792:android:c1f0badd73bbad9d25a75d"
};

// Inicializar Firebase 
const app = initializeApp(FirebaseConf);

// Inicializa Firebase Auth con persistencia condicional
export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web'
    ? browserLocalPersistence // Usa esta si estás en la web
    : getReactNativePersistence(ReactNativeAsyncStorage) // Usa esta para iOS/Android
});


export const db = getFirestore(app);


export { serverTimestamp };