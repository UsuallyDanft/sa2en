import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { auth, db } from '../FirebaseConf';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function PantallaDeInicio() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [puesto, setPuesto] = useState('');
  const [tipoLogin, setTipoLogin] = useState('gerente'); // 'gerente' o 'empleado'
  const [loading, setLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [puestoFocused, setPuestoFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();
  const { loginManual } = useAuth();

  const handleGerenteLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar si el usuario es gerente
      const gerenteDoc = await getDoc(doc(db, 'gerentes', user.uid));

      if (!gerenteDoc.exists()) {
        await auth.signOut();
        throw new Error('No tienes permisos de gerente para acceder');
      }

      // La navegación se manejará automáticamente por el AuthContext

    } catch (error) {
      console.error('Error en login de gerente:', error);
      let mensaje = 'Error al iniciar sesión';

      if (error.code === 'auth/user-not-found') {
        mensaje = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        mensaje = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo electrónico inválido';
      } else if (error.message) {
        mensaje = error.message;
      }

      setErrorMessage(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleEmpleadoLogin = async () => {
    if (!email.trim() || !password.trim() || !puesto.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

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
      await signInWithEmailAndPassword(auth, email, password);

      // La navegación se manejará automáticamente por el AuthContext

    } catch (error) {
      console.error('Error en login de empleado:', error);
      let mensaje = 'Error al iniciar sesión';

      if (error.code === 'auth/user-not-found') {
        mensaje = 'Usuario no encontrado en el sistema';
      } else if (error.code === 'auth/wrong-password') {
        mensaje = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo electrónico inválido';
      } else if (error.message) {
        mensaje = error.message;
      }

      setErrorMessage(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (tipoLogin === 'gerente') {
      handleGerenteLogin();
    } else {
      handleEmpleadoLogin();
    }
  };

  // Funciones para los botones de prueba mejoradas
  const handleTestGerenteLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Usar el contexto de Auth para login manual
      const success = await loginManual('gerente');
      
      if (success) {
        // La navegación se manejará automáticamente por el AuthContext
        console.log('✅ Login de prueba como gerente exitoso');
      } else {
        setErrorMessage('Error en login de prueba');
      }
    } catch (error) {
      console.error('Error en login de prueba gerente:', error);
      setErrorMessage('Error en login de prueba');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmpleadoLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Usar el contexto de Auth para login manual
      const success = await loginManual('empleado');
      
      if (success) {
        // La navegación se manejará automáticamente por el AuthContext
        console.log('✅ Login de prueba como empleado exitoso');
      } else {
        setErrorMessage('Error en login de prueba');
      }
    } catch (error) {
      console.error('Error en login de prueba empleado:', error);
      setErrorMessage('Error en login de prueba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <ImageBackground
          source={require('../assets/Fondo1.png')}
          style={styles.container}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} />

      <View style={styles.formContainer}>
        <View style={styles.errorMessage}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        {/* Selector de tipo de login */}
        <View style={styles.radioContainer}>
          <TouchableOpacity 
            style={styles.radioButton} 
            onPress={() => setTipoLogin('gerente')}
          >
            <View style={[styles.radioCircle, tipoLogin === 'gerente' && styles.radioSelected]}>
              {tipoLogin === 'gerente' && <View style={styles.radioInnerCircle}/>}
            </View>
            <Text style={styles.radioLabel}>Ingresar como Gerente</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.radioButton} 
            onPress={() => setTipoLogin('empleado')}
          >
            <View style={[styles.radioCircle, tipoLogin === 'empleado' && styles.radioSelected]}>
              {tipoLogin === 'empleado' && <View style={styles.radioInnerCircle}/>}
            </View>
            <Text style={styles.radioLabel}>Ingresar como Empleado</Text>
          </TouchableOpacity>
        </View>

        {/* Input de correo */}
        <TextInput
          style={[styles.input, emailFocused && styles.inputFocused]}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Input de puesto (solo para empleados) */}
        {tipoLogin === 'empleado' && (
          <TextInput
            style={[styles.input, puestoFocused && styles.inputFocused]}
            placeholder="Puesto"
            value={puesto}
            onChangeText={setPuesto}
            onFocus={() => setPuestoFocused(true)}
            onBlur={() => setPuestoFocused(false)}
          />
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.inputPassword, passwordFocused && styles.inputFocused]}
            placeholder="Contraseña"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />

          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Feather
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={15}
              paddingHorizontal={10}
              color="gray"
              accessibilityLabel="Mostrar/Ocultar contraseña"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.recoverContainer}>
          <Text style={styles.recoverText}>¿Olvidaste tu contraseña?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Recuperar')}>
            <Text style={styles.recoverLink}> Recuperar</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Login */}
        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        {/* Botones de prueba temporales */}
        <View style={styles.testButtonsContainer}>
          <Text style={styles.testTitle}>🧪 Botones de Prueba:</Text>

          <TouchableOpacity 
            style={[styles.button, styles.testButton, styles.testButtonGerente]} 
            onPress={handleTestGerenteLogin}
          >
            <Text style={styles.buttonText}>🔑 Login Gerente (Test)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.testButton, styles.testButtonEmpleado]} 
            onPress={handleTestEmpleadoLogin}
          >
            <Text style={styles.buttonText}>👤 Login Empleado (Test)</Text>
          </TouchableOpacity>
        </View>

        {tipoLogin === 'gerente' && (
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿Primer gerente?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegistrarGerente')}>
              <Text style={styles.registerLink}> Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 150, 
    height: 90,
    resizeMode: 'center',
    marginBottom: 10,
  },
  formContainer: {
    width: '85%',
    minHeight: 650,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },
  input: { 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 15,
  },
  errorMessage: {
    marginTop: 5,
  },
  inputFocused: {
    borderColor: '#FFA500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 15,
  },
  inputPassword: {
    flex: 1, 
    padding: 10,
  },
  recoverContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 15,
    paddingLeft: 75,
  },
  recoverText: {
    fontSize: 11,
    color: '#000',
  },
  recoverLink: {
    fontSize: 11,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#000',
  },
  registerLink: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  radioContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: '#000',
  },
  radioInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioLabel: {
    fontSize: 14,
  },
  testButtonsContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  testTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  testButton: {
    marginVertical: 8,
  },
  testButtonGerente: {
    backgroundColor: '#28a745',
  },
  testButtonEmpleado: {
    backgroundColor: '#007bff',
  },
});