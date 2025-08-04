import { auth, db } from '../FirebaseConf';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Servicio de autenticación centralizado
 */
class AuthService {
  /**
   * Iniciar sesión como gerente
   */
  async loginGerente(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar si el usuario es gerente
      const gerenteDoc = await getDoc(doc(db, 'gerentes', user.uid));
      
      if (!gerenteDoc.exists()) {
        await signOut(auth);
        throw new Error('No tienes permisos de gerente para acceder');
      }

      return {
        success: true,
        user: user,
        role: 'gerente',
        profile: {
          ...gerenteDoc.data(),
          uid: user.uid,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Error en login de gerente:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Iniciar sesión como empleado
   */
  async loginEmpleado(email, password, puesto) {
    try {
      // Primero verificar si el empleado está autorizado
      const empleadoDoc = await getDoc(doc(db, 'empleados_autorizados', email));
      
      if (!empleadoDoc.exists()) {
        throw new Error('Este correo no está autorizado para acceder como empleado');
      }

      const empleadoData = empleadoDoc.data();
      
      // Verificar que el puesto coincida
      if (empleadoData.puesto !== puesto) {
        throw new Error('El puesto ingresado no coincide con el registrado');
      }

      // Intentar iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return {
        success: true,
        user: user,
        role: 'empleado',
        profile: {
          ...empleadoData,
          uid: user.uid,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Error en login de empleado:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }
  }

  /**
   * Obtener estado de autenticación
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Primero verificar si es gerente
          const gerenteDoc = await getDoc(doc(db, 'gerentes', firebaseUser.uid));
          
          if (gerenteDoc.exists()) {
            const gerenteData = gerenteDoc.data();
            callback({
              user: firebaseUser,
              role: 'gerente',
              profile: {
                ...gerenteData,
                uid: firebaseUser.uid,
                email: firebaseUser.email
              },
              isAuthenticated: true
            });
          } else {
            // Si no es gerente, verificar si es empleado
            const empleadoDoc = await getDoc(doc(db, 'empleados_autorizados', firebaseUser.email));
            
            if (empleadoDoc.exists()) {
              const empleadoData = empleadoDoc.data();
              callback({
                user: firebaseUser,
                role: 'empleado',
                profile: {
                  ...empleadoData,
                  uid: firebaseUser.uid,
                  email: firebaseUser.email
                },
                isAuthenticated: true
              });
            } else {
              // Usuario no autorizado
              await signOut(auth);
              callback({
                user: null,
                role: null,
                profile: null,
                isAuthenticated: false
              });
            }
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          callback({
            user: null,
            role: null,
            profile: null,
            isAuthenticated: false
          });
        }
      } else {
        callback({
          user: null,
          role: null,
          profile: null,
          isAuthenticated: false
        });
      }
    });
  }

  /**
   * Convertir errores de Firebase a mensajes legibles
   */
  getErrorMessage(error) {
    if (error.code === 'auth/user-not-found') {
      return 'Usuario no encontrado';
    } else if (error.code === 'auth/wrong-password') {
      return 'Contraseña incorrecta';
    } else if (error.code === 'auth/invalid-email') {
      return 'Correo electrónico inválido';
    } else if (error.code === 'auth/too-many-requests') {
      return 'Demasiados intentos. Intenta más tarde';
    } else if (error.code === 'auth/network-request-failed') {
      return 'Error de conexión. Verifica tu internet';
    } else if (error.message) {
      return error.message;
    } else {
      return 'Error al iniciar sesión';
    }
  }
}

export default new AuthService(); 