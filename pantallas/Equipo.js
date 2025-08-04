import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../FirebaseConf';
import { auth } from '../FirebaseConf';
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CrearEquipo() {
  const [email, setEmail] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('normal');
  const [rol, setRol] = useState('supervisor');
  const [loading, setLoading] = useState(false);

  const handleCrearEquipo = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const userDoc = await getDoc(doc(db, 'usuarios', currentUser.uid));
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      if (userDoc.data().tipoUsuario !== 'admin') {
        throw new Error('Solo los administradores pueden crear equipos');
      }

      await setDoc(doc(db, 'emailsAutorizados', email), {
        email: email,
        tipoCuenta: tipoCuenta,
        rol: rol,
        creadoPor: currentUser.email,
        fechaCreacion: serverTimestamp()
      });

      Alert.alert('Éxito', 'Usuario autorizado registrado correctamente');
      setEmail('');

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Nuevo Miembro</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Tipo de cuenta:</Text>
      <Picker
        selectedValue={tipoCuenta}
        style={styles.picker}
        onValueChange={(itemValue) => setTipoCuenta(itemValue)}>
        <Picker.Item label="Normal" value="normal" />
        <Picker.Item label="Administrador" value="admin" />
      </Picker>

      <Text style={styles.label}>Rol del usuario:</Text>
      <Picker
        selectedValue={rol}
        style={styles.picker}
        onValueChange={(itemValue) => setRol(itemValue)}>
        <Picker.Item label="Supervisor" value="supervisor" />
        <Picker.Item label="Encargado" value="encargado" />
        <Picker.Item label="Contador" value="contador" />
        <Picker.Item label="Visualizador" value="visualizador" />
      </Picker>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCrearEquipo}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Procesando...' : 'Autorizar Usuario'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555'
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});