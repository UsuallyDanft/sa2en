
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../FirebaseConf';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function P1Admin() {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    email: '',
    nombre: '',
    puesto: ''
  });
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [nombreFocused, setNombreFocused] = useState(false);
  const [puestoFocused, setPuestoFocused] = useState(false);

  const navigation = useNavigation();
  const { userRole, userProfile } = useAuth();

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const empleadosSnapshot = await getDocs(collection(db, 'empleados_autorizados'));
      const empleadosList = empleadosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmpleados(empleadosList);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      Alert.alert('Error', 'No se pudieron cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  const agregarEmpleado = async () => {
    if (!nuevoEmpleado.email || !nuevoEmpleado.nombre || !nuevoEmpleado.puesto) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nuevoEmpleado.email)) {
      Alert.alert('Error', 'Por favor ingrese un email válido');
      return;
    }

    try {
      setLoading(true);
      
      await addDoc(collection(db, 'empleados_autorizados'), {
        email: nuevoEmpleado.email,
        nombre: nuevoEmpleado.nombre,
        puesto: nuevoEmpleado.puesto,
        fechaCreacion: serverTimestamp(),
        activo: true,
        creadoPor: userProfile?.email || 'admin'
      });

      setNuevoEmpleado({ email: '', nombre: '', puesto: '' });
      await cargarEmpleados();
      Alert.alert('Éxito', 'Empleado agregado correctamente');

    } catch (error) {
      console.error('Error al agregar empleado:', error);
      Alert.alert('Error', 'No se pudo agregar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const eliminarEmpleado = async (empleadoId, empleadoNombre) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar a ${empleadoNombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteDoc(doc(db, 'empleados_autorizados', empleadoId));
              await cargarEmpleados();
              Alert.alert('Éxito', 'Empleado eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar empleado:', error);
              Alert.alert('Error', 'No se pudo eliminar el empleado');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (userRole !== 'gerente') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={50} color="#dc3545" />
          <Text style={styles.errorText}>
            Solo los gerentes pueden acceder a esta sección
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Administrar Empleados</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Formulario para agregar empleado */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Agregar Nuevo Empleado</Text>

            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="Email del empleado"
              value={nuevoEmpleado.email}
              onChangeText={(text) => setNuevoEmpleado({...nuevoEmpleado, email: text})}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.input, nombreFocused && styles.inputFocused]}
              placeholder="Nombre completo"
              value={nuevoEmpleado.nombre}
              onChangeText={(text) => setNuevoEmpleado({...nuevoEmpleado, nombre: text})}
              onFocus={() => setNombreFocused(true)}
              onBlur={() => setNombreFocused(false)}
            />

            <TextInput
              style={[styles.input, puestoFocused && styles.inputFocused]}
              placeholder="Puesto de trabajo"
              value={nuevoEmpleado.puesto}
              onChangeText={(text) => setNuevoEmpleado({...nuevoEmpleado, puesto: text})}
              onFocus={() => setPuestoFocused(true)}
              onBlur={() => setPuestoFocused(false)}
            />

            <TouchableOpacity 
              style={[styles.addButton, loading && { opacity: 0.7 }]}
              onPress={agregarEmpleado}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="user-plus" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Agregar Empleado</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Lista de empleados */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              Empleados Autorizados ({empleados.length})
            </Text>

            {loading && empleados.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Cargando empleados...</Text>
              </View>
            ) : empleados.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="users" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No hay empleados registrados</Text>
              </View>
            ) : (
              empleados.map((empleado) => (
                <View key={empleado.id} style={styles.empleadoCard}>
                  <View style={styles.empleadoInfo}>
                    <Text style={styles.empleadoNombre}>{empleado.nombre}</Text>
                    <Text style={styles.empleadoEmail}>{empleado.email}</Text>
                    <Text style={styles.empleadoPuesto}>{empleado.puesto}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => eliminarEmpleado(empleado.id, empleado.nombre)}
                  >
                    <Feather name="trash-2" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#007BFF',
  },
  addButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  empleadoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    marginBottom: 10,
  },
  empleadoInfo: {
    flex: 1,
  },
  empleadoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  empleadoEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  empleadoPuesto: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
