
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../FirebaseConf';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Primero verificar si es gerente
          const gerenteDoc = await getDoc(doc(db, 'gerentes', firebaseUser.uid));
          
          if (gerenteDoc.exists()) {
            const gerenteData = gerenteDoc.data();
            setUser(firebaseUser);
            setUserRole('gerente');
            setUserProfile({
              ...gerenteData,
              uid: firebaseUser.uid,
              email: firebaseUser.email
            });
            setIsAuthenticated(true);
          } else {
            // Si no es gerente, verificar si es empleado
            const empleadoDoc = await getDoc(doc(db, 'empleados_autorizados', firebaseUser.email));
            
            if (empleadoDoc.exists()) {
              const empleadoData = empleadoDoc.data();
              setUser(firebaseUser);
              setUserRole('empleado');
              setUserProfile({
                ...empleadoData,
                uid: firebaseUser.uid,
                email: firebaseUser.email
              });
              setIsAuthenticated(true);
            } else {
              // Usuario no autorizado
              await signOut(auth);
              setUser(null);
              setUserRole(null);
              setUserProfile(null);
              setIsAuthenticated(false);
            }
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
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

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    userProfile,
    loading,
    isAuthenticated,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
