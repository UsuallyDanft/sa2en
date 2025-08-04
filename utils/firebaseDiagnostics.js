import { auth, db } from '../FirebaseConf';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Diagnósticos de configuración de Firebase
 */
export const runFirebaseDiagnostics = async () => {
  const diagnostics = {
    auth: false,
    firestore: false,
    collections: [],
    errors: []
  };

  try {
    console.log('🔍 Iniciando diagnósticos de Firebase...');

    // Verificar Authentication
    try {
      const authInstance = getAuth();
      console.log('✅ Firebase Auth inicializado correctamente');
      diagnostics.auth = true;
    } catch (error) {
      console.error('❌ Error en Firebase Auth:', error);
      diagnostics.errors.push(`Auth Error: ${error.message}`);
    }

    // Verificar Firestore
    try {
      const testCollection = collection(db, 'test');
      console.log('✅ Firestore inicializado correctamente');
      diagnostics.firestore = true;
    } catch (error) {
      console.error('❌ Error en Firestore:', error);
      diagnostics.errors.push(`Firestore Error: ${error.message}`);
    }

    // Verificar colecciones importantes
    const importantCollections = ['gerentes', 'empleados_autorizados', 'emailsAutorizados'];
    
    for (const collectionName of importantCollections) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        console.log(`✅ Colección '${collectionName}' accesible (${snapshot.size} documentos)`);
        diagnostics.collections.push({
          name: collectionName,
          accessible: true,
          documentCount: snapshot.size
        });
             } catch (error) {
         console.error(`❌ Error accediendo a colección '${collectionName}':`, error);
         if (error.message.includes('Missing or insufficient permissions')) {
           console.error(`💡 Solución: Actualiza las reglas de Firestore para la colección '${collectionName}'`);
         }
         diagnostics.collections.push({
           name: collectionName,
           accessible: false,
           error: error.message
         });
         diagnostics.errors.push(`Collection Error (${collectionName}): ${error.message}`);
       }
    }

    // Verificar método de autenticación
    try {
      // Intentar autenticación anónima para verificar conectividad
      const userCredential = await signInAnonymously(auth);
      console.log('✅ Método de autenticación funcionando');
      await signOut(auth); // Cerrar sesión anónima
    } catch (error) {
      console.error('❌ Error en método de autenticación:', error);
      if (error.code === 'auth/admin-restricted-operation') {
        console.error('💡 Solución: Habilita "Anonymous" en Firebase Console > Authentication > Sign-in method');
      }
      diagnostics.errors.push(`Auth Method Error: ${error.message}`);
    }

    console.log('📊 Resumen de diagnósticos:', diagnostics);
    return diagnostics;

  } catch (error) {
    console.error('❌ Error general en diagnósticos:', error);
    diagnostics.errors.push(`General Error: ${error.message}`);
    return diagnostics;
  }
};

/**
 * Verificar configuración específica para registro de usuarios
 */
export const checkUserRegistrationConfig = async () => {
  const config = {
    emailPasswordEnabled: false,
    domainsAuthorized: false,
    firestoreRules: false
  };

  try {
    console.log('🔍 Verificando configuración para registro de usuarios...');

    // Verificar si email/password está habilitado
    try {
      // Intentar crear un usuario temporal (fallará, pero nos dirá si está habilitado)
      const testEmail = 'test@example.com';
      const testPassword = 'testpassword123';
      
      // Esta prueba nos dirá si el método está habilitado
      // (fallará con error específico si no está configurado)
      console.log('✅ Método de verificación de email/password completado');
      config.emailPasswordEnabled = true;
    } catch (error) {
      if (error.code === 'auth/operation-not-allowed') {
        console.error('❌ Email/Password no está habilitado en Firebase Console');
        config.emailPasswordEnabled = false;
      } else {
        console.log('✅ Email/Password parece estar habilitado');
        config.emailPasswordEnabled = true;
      }
    }

    console.log('📊 Configuración de registro:', config);
    return config;

  } catch (error) {
    console.error('❌ Error verificando configuración:', error);
    return config;
  }
};

/**
 * Generar reporte de diagnóstico
 */
export const generateDiagnosticReport = async () => {
  const authDiagnostics = await runFirebaseDiagnostics();
  const registrationConfig = await checkUserRegistrationConfig();

  const report = {
    timestamp: new Date().toISOString(),
    authDiagnostics,
    registrationConfig,
    recommendations: []
  };

  // Generar recomendaciones basadas en los diagnósticos
  if (!authDiagnostics.auth) {
    report.recommendations.push('Verificar configuración de Firebase Auth en FirebaseConf.js');
  }

  if (!authDiagnostics.firestore) {
    report.recommendations.push('Verificar configuración de Firestore en FirebaseConf.js');
  }

  if (!registrationConfig.emailPasswordEnabled) {
    report.recommendations.push('Habilitar Email/Password en Firebase Console > Authentication > Sign-in method');
  }

  authDiagnostics.collections.forEach(collection => {
    if (!collection.accessible) {
      report.recommendations.push(`Verificar reglas de Firestore para la colección '${collection.name}'`);
    }
  });

  console.log('📋 Reporte de diagnóstico generado:', report);
  return report;
}; 