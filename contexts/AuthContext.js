
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../FirebaseConf';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para obtener el perfil del usuario
  const getUserProfile = async (user) => {
    if (!user) return null;

    try {
      // Primero verificar si es gerente
      const gerenteDoc = await getDoc(doc(db, 'gerentes', user.uid));
      if (gerenteDoc.exists()) {
        return { ...gerenteDoc.data(), role: 'gerente' };
      }

      // Luego verificar si es empleado autorizado
      const empleadoDoc = await getDoc(doc(db, 'empleados_autorizados', user.email));
      if (empleadoDoc.exists()) {
        return { ...empleadoDoc.data(), role: 'empleado' };
      }

      return null;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return null;
    }
  };

  // Login manual para pruebas
  const loginManual = async (role) => {
    try {
      const mockUser = {
        uid: role === 'gerente' ? 'mock-gerente-id' : 'mock-empleado-id',
        email: role === 'gerente' ? 'gerente@test.com' : 'empleado@test.com'
      };

      const mockProfile = {
        nombre: role === 'gerente' ? 'Gerente Test' : 'Empleado Test',
        email: mockUser.email,
        puesto: role === 'empleado' ? 'Operario' : 'Gerente',
        role: role
      };

      setUser(mockUser);
      setUserRole(role);
      setUserProfile(mockProfile);
      setIsAuthenticated(true);
      
      console.log(`✅ Login manual como ${role} exitoso`);
      return true;
    } catch (error) {
      console.error('Error en login manual:', error);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  // Listener de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser);
          
          if (profile) {
            setUser(firebaseUser);
            setUserRole(profile.role);
            setUserProfile(profile);
            setIsAuthenticated(true);
          } else {
            // Usuario no autorizado
            await signOut(auth);
            setUser(null);
            setUserRole(null);
            setUserProfile(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error al procesar usuario:', error);
          setUser(null);
          setUserRole(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userRole,
    userProfile,
    isAuthenticated,
    loading,
    logout,
    loginManual // Para pruebas
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
