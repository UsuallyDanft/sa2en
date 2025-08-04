
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../FirebaseConf';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function Recuperar() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigation = useNavigation();

  const handleRecoverPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Se ha enviado un correo de recuperación a tu dirección de email.');
      
      // Opcional: navegar de vuelta después de unos segundos
      setTimeout(() => {
        navigation.navigate('Inicio');
      }, 3000);
      
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      let mensaje = 'Error al enviar el correo de recuperación';
      
      if (error.code === 'auth/user-not-found') {
        mensaje = 'No existe una cuenta con este correo electrónico';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo electrónico inválido';
      } else if (error.code === 'auth/too-many-requests') {
        mensaje = 'Demasiados intentos. Intenta más tarde';
      }
      
      setErrorMessage(mensaje);
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
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </Text>

            <View style={styles.errorMessage}>
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
              {successMessage ? (
                <Text style={styles.successText}>{successMessage}</Text>
              ) : null}
            </View>

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

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRecoverPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Enviar Correo de Recuperación</Text>
              )}
            </TouchableOpacity>

            <View style={styles.backContainer}>
              <Text style={styles.backText}>¿Recordaste tu contraseña?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
                <Text style={styles.backLink}> Volver al Login</Text>
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
    resizeMode: 'contain',
    marginBottom: 10,
  },
  formContainer: {
    width: '85%',
    minHeight: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: { 
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 15,
    fontSize: 16,
  },
  errorMessage: {
    marginTop: 5,
    minHeight: 20,
  },
  inputFocused: {
    borderColor: '#FFA500',
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  backText: {
    fontSize: 14,
    color: '#000',
  },
  backLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 13,
    textAlign: 'center',
  },
});
