import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import registrationService from '../services/registrationService'; //
import { Picker } from '@react-native-picker/picker';


export default function RegistrarGerente() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nombreFocused, setNombreFocused] = useState(false);
  const [apellidoFocused, setApellidoFocused] = useState(false);
  const [numeroDocumentoFocused, setNumeroDocumentoFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confpasswordFocused, setConfPasswordFocused] = useState(false);
  const [confpasswordVisible, setConfPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim() || !confpassword.trim() || !numeroDocumento.trim()) {
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
      const result = await registrationService.registerGerente(
        nombre,
        apellido,
        email,
        password,
        tipoDocumento,
        numeroDocumento
      );
      
      if (result.success) {
        Alert.alert('Éxito', result.message);
        // La navegación se manejará automáticamente por el AuthContext
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Error en registro de gerente:', error);
      setErrorMessage('Error al crear cuenta');
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
        <Text style={styles.title}>Registro de Gerente</Text>
        
        <View style={styles.errorMessage}>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <TextInput
          style={[styles.input, nombreFocused && styles.inputFocused]}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          onFocus={() => setNombreFocused(true)}
          onBlur={() => setNombreFocused(false)}
        />

        <TextInput
          style={[styles.input, apellidoFocused && styles.inputFocused]}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
          onFocus={() => setApellidoFocused(true)}
          onBlur={() => setApellidoFocused(false)}
        />

        <View style={styles.documentRow}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoDocumento}
              onValueChange={(itemValue) => setTipoDocumento(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="DNI" value="DNI" />
              <Picker.Item label="CE" value="CE" />
            </Picker>
          </View>
          <TextInput
            style={[styles.inputDocumento]}
            placeholder="N° Documento"
            value={numeroDocumento}
            onChangeText={setNumeroDocumento}
            keyboardType="numeric"
            maxLength={tipoDocumento === 'DNI' ? 8 : 12}
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
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.inputPassword, confpasswordFocused && styles.inputFocused]}
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
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Cuenta</Text>
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
    height: 600,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    marginTop: 10,
  },
  inputPassword: {
    flex: 1, 
    padding: 10,
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
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    width: '100%',
    borderRadius: 8,
  },
  inputDocumento: {
    flex: 2,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
