import React, { useState } from 'react'
import {View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity,} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Feather from '@expo/vector-icons/Feather' // Iconos

export default function PantallaDeInicio() {
  // Guardan los valores de los inputs
  const [email, setEmail] = useState('')  
  const [password, setPassword] = useState('')

  //  Detectan si el usuario está escribiendo en el input
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')  // Almacena mensajes de error de validación.
  const navigation = useNavigation()

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, complete todos los campos.')
      return;
    }
    setErrorMessage('');
    navigation.navigate('P1Admin')
  };

  return (
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
        />
       
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.inputPassword,
              passwordFocused && styles.inputFocused,
            ]}
            placeholder="Contraseña"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}>
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

       
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

      
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
            <Text style={styles.registerLink}> Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    //Contenedor principal
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
    //Contenedor del formulario
    width: '85%',
    height: 450,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },
   //Campo de entrada para el correo electrónico
  input: { 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 30, // Más separación
  },

  errorMessage: {
    marginTop: 5,
  },
   // Estilo que se aplica cuando el campo de correo está enfocado
  inputFocused: {
    borderColor: '#FFA500',
  },
   //Contenedor para el campo de entrada de contraseña y el ícono de mostrar/ocultar la contraseña.
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 20, // Más separación con el input de arriba
  },
   //Campo de entrada para la contraseña.
  inputPassword: {
    flex: 1, 
    padding: 10,
    
  },


  recoverContainer: {
    //Contenedor de, Olvidaste tu contraseña?
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
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

})
