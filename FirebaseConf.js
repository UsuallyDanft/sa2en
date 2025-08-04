
// Importa las funciones necesarias de los SDKs de Firebase que uses
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence, // Para nativo
  browserLocalPersistence   // Para la web
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native'; // Importante para detectar la plataforma

// Configuración de Firebase
const FirebaseConf = {
  apiKey: "AIzaSyCt9L4LzFJK2icufGt0HYiuGwhgKxhM7v0",
  authDomain: "sa2en-app.firebaseapp.com",
  projectId: "sa2en-app",
  storageBucket: "sa2en-app.appspot.com",
  messagingSenderId: "493790722792",
  appId: "1:493790722792:android:c1f0badd73bbad9d25a75d"
};

// Validar que la configuración esté completa
const validateConfig = (config) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Faltan campos de configuración de Firebase: ${missingFields.join(', ')}`);
  }
};

let app;
let auth;
let db;

try {
  // Validar configuración antes de inicializar
  validateConfig(FirebaseConf);
  
  // Inicializar Firebase 
  app = initializeApp(FirebaseConf);
  
  // Inicializar Firebase Auth
  if (Platform.OS === 'web') {
    // Para web, usar getAuth directamente
    auth = getAuth(app);
  } else {
    // Para móvil, usar initializeAuth con persistencia
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  }
  
  // Inicializar Firestore
  db = getFirestore(app);
  
  console.log('✅ Firebase configurado correctamente');
  
} catch (error) {
  console.error('❌ Error al configurar Firebase:', error.message);
  throw error;
}

// Exportar las instancias
export { auth, db, serverTimestamp };

// Exportar también la app por si se necesita
export default app;
