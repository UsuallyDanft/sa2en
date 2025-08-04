
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

  // Inicializa Firebase Auth con persistencia condicional
  auth = initializeAuth(app, {
    persistence: Platform.OS === 'web'
      ? browserLocalPersistence // Usa esta si estás en la web
      : getReactNativePersistence(ReactNativeAsyncStorage) // Usa esta para iOS/Android
  });

  // Inicializar Firestore
  db = getFirestore(app);

  // Log informativo según la plataforma
  if (Platform.OS === 'web') {
    console.log('🌐 Firebase configurado para WEB con persistencia browserLocal');
  } else {
    console.log('📱 Firebase configurado para MÓVIL con persistencia AsyncStorage');
    console.log('📱 Plataforma detectada:', Platform.OS);
  }

  console.log('✅ Firebase configurado correctamente');

} catch (error) {
  console.error('❌ Error al configurar Firebase:', error.message);
  throw error;
}

// Exportar las instancias
export { auth, db, serverTimestamp };

// Exportar también la app por si se necesita
export default app;
