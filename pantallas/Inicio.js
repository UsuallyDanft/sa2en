import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import authService from '../services/authService';

export default function PantallaDeInicio() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await authService.loginGerente(email, password);
      if (result.success) {
        // La navegación se manejará automáticamente por el AuthContext
        console.log('Login de gerente exitoso');
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Error en login de gerente:', error);
      setErrorMessage('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
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

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Primer gerente?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegistrarGerente')}>
            <Text style={styles.registerLink}> Crear cuenta</Text>
          </TouchableOpacity>
        </View>
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
    height: 400,
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
    color: '#007BFF',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
});
