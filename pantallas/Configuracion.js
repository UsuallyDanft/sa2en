
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { auth, db, serverTimestamp } from '../FirebaseConf';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Configuracion() {
  const [email, setEmail] = useState('');
  const [puesto, setPuesto] = useState('');
  const [password, setPassword] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { userProfile, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'empleados_autorizados'));
      const empleadosData = [];
      querySnapshot.forEach((doc) => {
        empleadosData.push({ id: doc.id, ...doc.data() });
      });
      setEmpleados(empleadosData);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const agregarEmpleado = async () => {
    if (!email.trim() || !puesto.trim() || !password.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar en la colección de empleados autorizados
      await setDoc(doc(db, 'empleados_autorizados', email), {
        correo: email,
        puesto,
        fechaRegistro: serverTimestamp(),
        autorizado_por: userProfile.uid
      });

      // Cerrar sesión del empleado recién creado para volver al gerente
      await auth.signOut();
      
      // Reiniciar el formulario
      setEmail('');
      setPuesto('');
      setPassword('');
      setShowForm(false);
      
      // Recargar la lista
      await cargarEmpleados();
      
      Alert.alert('Éxito', 'Empleado agregado correctamente');
      
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      let mensaje = 'Error al agregar empleado';
      
      if (error.code === 'auth/email-already-in-use') {
        mensaje = 'Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo electrónico inválido';
      }
      
      setErrorMessage(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const eliminarEmpleado = async (empleadoEmail) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este empleado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'empleados_autorizados', empleadoEmail));
              await cargarEmpleados();
              Alert.alert('Éxito', 'Empleado eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar empleado:', error);
              Alert.alert('Error', 'No se pudo eliminar el empleado');
            }
          }
        }
      ]
    );
  };

  const renderEmpleado = ({ item }) => (
    <View style={styles.empleadoItem}>
      <View style={styles.empleadoInfo}>
        <Text style={styles.empleadoEmail}>{item.correo}</Text>
        <Text style={styles.empleadoPuesto}>{item.puesto}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => eliminarEmpleado(item.correo)}
      >
        <Feather name="trash-2" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

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
          style={styles.container}
        >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Feather name="log-out" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empleados Autorizados</Text>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Feather name={showForm ? "minus" : "plus"} size={20} color="#fff" />
            <Text style={styles.addButtonText}>
              {showForm ? "Cancelar" : "Agregar Empleado"}
            </Text>
          </TouchableOpacity>

          {showForm && (
            <View style={styles.form}>
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                placeholder="Puesto"
                value={puesto}
                onChangeText={setPuesto}
              />

              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={agregarEmpleado}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Agregar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={empleados}
            renderItem={renderEmpleado}
            keyExtractor={(item) => item.correo}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  form: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  empleadoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  empleadoInfo: {
    flex: 1,
  },
  empleadoEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  empleadoPuesto: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
});
