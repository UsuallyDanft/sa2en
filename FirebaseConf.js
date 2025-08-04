
// Importa las funciones necesarias de los SDKs de Firebase que uses
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Importar Platform de manera segura para web
let Platform;
try {
  Platform = require('react-native').Platform;
} catch (error) {
  // Fallback para entorno web
  Platform = {
    OS: typeof window !== 'undefined' ? 'web' : 'ios',
    select: (obj) => obj.web || obj.default || obj.ios
  };
}

// Configuración de Firebase simplificada
const firebaseConfig = {
  apiKey: "AIzaSyCt9L4LzFJK2icufGt0HYiuGwhgKxhM7v0",
  authDomain: "sa2en-app.firebaseapp.com",
  projectId: "sa2en-app",
  storageBucket: "sa2en-app.appspot.com",
  messagingSenderId: "493790722792",
  appId: "1:493790722792:android:c1f0badd73bbad9d25a75d"
};

let app;
let auth;
let db;

try {
  // Inicializar Firebase app
  app = initializeApp(firebaseConfig);
  
  // Inicializar Auth de forma simple
  auth = getAuth(app);
  
  // Inicializar Firestore de forma simple
  db = getFirestore(app);
  
  console.log('✅ Firebase inicializado correctamente');
  console.log(`📱 Plataforma: ${Platform.OS}`);
  
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error.message);
  
  // Crear instancias mock para evitar crashes
  auth = {
    onAuthStateChanged: () => () => {},
    signOut: () => Promise.resolve(),
    currentUser: null
  };
  
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve()
      })
    })
  };
  
  console.warn('⚠️ Usando instancias mock de Firebase');
}

// Exportar serverTimestamp de forma segura
let serverTimestamp;
try {
  const { serverTimestamp: st } = require('firebase/firestore');
  serverTimestamp = st;
} catch (error) {
  serverTimestamp = () => new Date();
}

export { auth, db, serverTimestamp };
export default app;
