import { auth, db, serverTimestamp } from '../FirebaseConf';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

/**
 * Servicio de registro centralizado  asi o mas?
 */
class RegistrationService {
  /**
   * Registrar un nuevo gerente
   */
  async registerGerente(nombre, apellido, email, password) {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos del gerente en Firestore
      await setDoc(doc(db, 'gerentes', user.uid), {
        nombre,
        apellido,
        correo: email,
        fechaRegistro: serverTimestamp(),
        rol: 'gerente'
      });

      return {
        success: true,
        user: user,
        message: 'Cuenta de gerente creada correctamente'
      };
    } catch (error) {
      console.error('Error en registro de gerente:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Registrar un nuevo usuario (empleado o admin)
   */
  async registerUsuario(nombre, apellido, numeroDocumento, email, password, tipoUsuario) {
    try {
      // 1. Verificar si el correo está autorizado
      const q = query(collection(db, 'emailsAutorizados'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Este correo no está autorizado para registrarse');
      }

      const userData = querySnapshot.docs[0].data();
      const rolAutorizado = userData.rol;

      // 2. Validar rol admin
      if (tipoUsuario === 'admin' && rolAutorizado !== 'admin') {
        throw new Error('No tienes permiso para registrarte como administrador.');
      }

      // 3. Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 4. Guardar datos en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        apellido,  
        numeroDocumento,
        email,
        tipoUsuario: rolAutorizado, // Usamos el rol autorizado
        fechaRegistro: serverTimestamp(),
      });

      return {
        success: true,
        user: user,
        role: rolAutorizado,
        message: 'Usuario registrado correctamente'
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Registrar un nuevo empleado (desde configuración)
   */
  async registerEmpleado(email, puesto, password, autorizadoPor) {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar en la colección de empleados autorizados
      await setDoc(doc(db, 'empleados_autorizados', email), {
        correo: email,
        puesto,
        fechaRegistro: serverTimestamp(),
        autorizado_por: autorizadoPor
      });

      // Cerrar sesión del empleado recién creado para volver al gerente
      await auth.signOut();
      
      return {
        success: true,
        message: 'Empleado agregado correctamente'
      };
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  



    /**
   * Convertir errores de Firebase a mensajes legibles
   */
  getErrorMessage(error) {
    if (error.code === 'auth/email-already-in-use') {
      return 'Este correo ya está registrado';
    } else if (error.code === 'auth/invalid-email') {
      return 'Correo electrónico inválido';
    } else if (error.code === 'auth/weak-password') {
      return 'La contraseña es muy débil';
    } else if (error.code === 'auth/operation-not-allowed') {
      return 'Error de configuración: El registro con email/password no está habilitado en Firebase. Contacta al administrador.';
    } else if (error.code === 'auth/network-request-failed') {
      return 'Error de conexión. Verifica tu conexión a internet.';
    } else if (error.code === 'auth/too-many-requests') {
      return 'Demasiados intentos. Intenta más tarde.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'Error al crear cuenta';
    }
  }
}

export default new RegistrationService(); 