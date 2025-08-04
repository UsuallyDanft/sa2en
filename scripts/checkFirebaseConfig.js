/**
 * Script para verificar la configuración de Firebase
 * Ejecutar con: node scripts/checkFirebaseConfig.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously, signOut } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Configuración de Firebase
const FirebaseConf = {
  apiKey: "AIzaSyCt9L4LzFJK2icufGt0HYiuGwhgKxhM7v0",
  authDomain: "sa2en-app.firebaseapp.com",
  projectId: "sa2en-app",
  storageBucket: "sa2en-app.appspot.com",
  messagingSenderId: "493790722792",
  appId: "1:493790722792:android:c1f0badd73bbad9d25a75d"
};

async function checkFirebaseConfig() {
  console.log('🔍 Verificando configuración de Firebase...\n');

  try {
    // Inicializar Firebase
    const app = initializeApp(FirebaseConf);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('✅ Firebase inicializado correctamente');

    // Verificar Authentication
    try {
      console.log('\n📱 Verificando Authentication...');
      const userCredential = await signInAnonymously(auth);
      console.log('✅ Autenticación anónima funcionando');
      await signOut(auth);
    } catch (error) {
      console.error('❌ Error en autenticación:', error.message);
      if (error.code === 'auth/admin-restricted-operation') {
        console.log('💡 Solución: Habilita "Anonymous" en Firebase Console');
      }
    }

    // Verificar Firestore
    try {
      console.log('\n🗄️ Verificando Firestore...');
      const testCollection = collection(db, 'test');
      console.log('✅ Firestore conectado correctamente');
    } catch (error) {
      console.error('❌ Error en Firestore:', error.message);
    }

    // Verificar colecciones importantes
    const collections = ['gerentes', 'empleados_autorizados', 'emailsAutorizados'];
    
    for (const collectionName of collections) {
      try {
        console.log(`\n📋 Verificando colección '${collectionName}'...`);
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        console.log(`✅ Colección '${collectionName}' accesible (${snapshot.size} documentos)`);
      } catch (error) {
        console.error(`❌ Error en colección '${collectionName}':`, error.message);
        if (error.message.includes('Missing or insufficient permissions')) {
          console.log('💡 Solución: Actualiza las reglas de Firestore');
        }
      }
    }

    console.log('\n🎉 Verificación completada!');
    console.log('\n📋 Resumen de acciones necesarias:');
    console.log('1. Ve a Firebase Console: https://console.firebase.google.com/project/sa2en-app');
    console.log('2. Authentication > Sign-in method > Habilita Email/Password y Anonymous');
    console.log('3. Firestore Database > Rules > Actualiza las reglas');
    console.log('4. Firestore Database > Data > Crea las colecciones necesarias');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar verificación
checkFirebaseConfig().catch(console.error); 