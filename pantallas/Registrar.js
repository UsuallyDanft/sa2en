import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../FirebaseConf';
import firebase from 'firebase';

export default function PantallaDeInicio() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('normal');
  const [loading, setLoading] = useState(false);

  const [nombreFocused, setNombreFocused] = useState(false);
  const [apellidoFocused, setApellidoFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [numeroDocumentoFocused, setNumeroDocumentoFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confpasswordFocused, setConfPasswordFocused] = useState(false);
  const [confpasswordVisible, setConfPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nombre.trim() || !apellido.trim() || !numeroDocumento.trim() || !email.trim() || !password.trim() || !confpassword.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    if (password !== confpassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Verificar si el correo está autorizado
      const emailSnapshot = await db.collection('emailsAutorizados').where('email', '==', email).get();
      
      if (emailSnapshot.empty) {
        Alert.alert('Error', 'Este correo no está autorizado para registrarse.');
        return;
      }

      const userData = emailSnapshot.docs[0].data();
      const rolAutorizado = userData.rol;

      // 2. Validar rol admin
      if (tipoUsuario === 'admin' && rolAutorizado !== 'admin') {
        Alert.alert('Error', 'No tienes permiso para registrarte como administrador.');
        return;
      }

      // 3. Crear usuario en Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // 4. Guardar datos en Firestore
      await db.collection('usuarios').doc(user.uid).set({
        nombre,
        apellido,
        tipoDocumento,
        numeroDocumento,
        email,
        tipoUsuario: rolAutorizado, // Usamos el rol autorizado
        fechaRegistro: firebase.firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate(rolAutorizado === 'admin' ? 'P1Admin' : 'Principal');
      
    } catch (error) {
      console.error('Error en registro:', error);
      setErrorMessage(error.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Fondo1.png')}
      style={styles.container}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

      <View style={styles.formContainer}>
        <View style={styles.errorMessage}>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <TextInput
          style={[styles.inputNombre, nombreFocused && styles.inputFocused]}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          onFocus={() => setNombreFocused(true)}
          onBlur={() => setNombreFocused(false)}
        />

        <TextInput
          style={[styles.inputApellido, apellidoFocused && styles.inputFocused]}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
          onFocus={() => setApellidoFocused(true)}
          onBlur={() => setApellidoFocused(false)}
        />

        <View style={styles.row}>
          <Picker
            selectedValue={tipoDocumento}
            style={styles.picker}
            onValueChange={(itemValue) => setTipoDocumento(itemValue)}
          >
            <Picker.Item label="DNI" value="DNI" />
            <Picker.Item label="CE" value="CE" />
          </Picker>

          <TextInput
            style={styles.inputnumeroDocumento}
            placeholder="Documento"
            keyboardType="numeric"
            value={numeroDocumento}
            onChangeText={setNumeroDocumento}
            onFocus={() => setNumeroDocumentoFocused(true)}
            onBlur={() => setNumeroDocumentoFocused(false)}
          />
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

        <View style={styles.confpasswordContainer}>
          <TextInput
            style={[styles.inputConfpassword, confpasswordFocused && styles.inputFocused]}
            placeholder="Confirme su contraseña"
            secureTextEntry={!confpasswordVisible}
            value={confpassword}
            onChangeText={setConfPassword}
            onFocus={() => setConfPasswordFocused(true)}
            onBlur={() => setConfPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setConfPasswordVisible(!confpasswordVisible)}>
            <Feather
              name={confpasswordVisible ? 'eye' : 'eye-off'}
              size={15}
              paddingHorizontal={10}
              color="gray"
              accessibilityLabel="Mostrar/Ocultar contraseña"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.radioContainer}>
          <View style={styles.radioOption}>
            <TouchableOpacity 
              style={styles.radioButton} 
              onPress={() => setTipoUsuario('admin')}
            >
              <View style={[styles.radioCircle, tipoUsuario === 'admin' && styles.radioSelected]}>
                {tipoUsuario === 'admin' && <View style={styles.radioInnerCircle}/>}
              </View>
              <Text style={styles.radioLabel}>Administrador</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.radioOption}>
            <TouchableOpacity 
              style={styles.radioButton} 
              onPress={() => setTipoUsuario('normal')}
            >
              <View style={[styles.radioCircle, tipoUsuario === 'normal' && styles.radioSelected]}>
                {tipoUsuario === 'normal' && <View style={styles.radioInnerCircle}/>}
              </View>
              <Text style={styles.radioLabel}>Usuario normal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>
     
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
            <Text style={styles.registerLink}> Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

// Los estilos se mantienen exactamente igual que en tu código original
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
    height: 600,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },
  inputNombre: { 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },
  inputApellido: { 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    borderBottomRightRadius: 8,
  },
  picker: {
    flex: 1,
    height: 47,
    paddingHorizontal: 5,
    backgroundColor: '#f2f2f2',
  },
  inputnumeroDocumento: {
    flex: 1,
    height: 47,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 5,
    textAlign: 'left',
    marginLeft: 5,
  },
  input: { 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
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
    marginTop: 20,
  },
  inputPassword: {
    flex: 1, 
    padding: 10,
  },
  confpasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 20,
  },
  inputConfpassword: {
    flex: 1, 
    padding: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 20,
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
  radioContainer: {
    width: '100%',
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'flex-end',
  },
  radioOption: {
    marginVertical: 5,
    width: '50%',
  },
  radioButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
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
    fontSize: 12,
    marginRight: 8,
  },
});