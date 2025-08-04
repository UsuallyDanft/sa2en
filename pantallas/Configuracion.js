
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../FirebaseConf';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function Configuracion() {
  const navigation = useNavigation();
  const { userProfile, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    montoMaximoEgreso: '10000',
    notificacionesActivas: true,
    requiereAprobacion: false,
    monedaDefault: 'ARS',
    limiteDiario: '50000',
  });
  
  const [formData, setFormData] = useState({ ...configuracion });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const configDoc = await getDoc(doc(db, 'configuracion', 'general'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setConfiguracion(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      Alert.alert('Error', 'No se pudo cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'configuracion', 'general'), {
        ...formData,
        fechaActualizacion: new Date(),
        actualizadoPor: userProfile?.email || 'unknown'
      });
      
      setConfiguracion(formData);
      Alert.alert('Éxito', 'Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      Alert.alert('Error', 'No se pudo guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const resetearConfiguracion = () => {
    Alert.alert(
      'Resetear Configuración',
      '¿Estás seguro de que quieres resetear toda la configuración a los valores por defecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: () => {
            const defaultConfig = {
              montoMaximoEgreso: '10000',
              notificacionesActivas: true,
              requiereAprobacion: false,
              monedaDefault: 'ARS',
              limiteDiario: '50000',
            };
            setFormData(defaultConfig);
          }
        }
      ]
    );
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        }
      ]
    );
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
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Configuración</Text>
            <TouchableOpacity onPress={guardarConfiguracion} disabled={loading}>
              <Feather name="save" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>

          {/* Información del Usuario */}
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <Feather name="user" size={40} color="#007BFF" />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{userProfile?.nombre || 'Administrador'}</Text>
                <Text style={styles.userEmail}>{userProfile?.email}</Text>
                <Text style={styles.userRole}>Gerente</Text>
              </View>
            </View>
          </View>

          {/* Configuraciones Monetarias */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Configuraciones Monetarias</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monto Máximo por Egreso</Text>
              <TextInput
                style={styles.input}
                value={formData.montoMaximoEgreso}
                onChangeText={(text) => setFormData({...formData, montoMaximoEgreso: text})}
                keyboardType="numeric"
                placeholder="10000"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Límite Diario</Text>
              <TextInput
                style={styles.input}
                value={formData.limiteDiario}
                onChangeText={(text) => setFormData({...formData, limiteDiario: text})}
                keyboardType="numeric"
                placeholder="50000"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Moneda por Defecto</Text>
              <TextInput
                style={styles.input}
                value={formData.monedaDefault}
                onChangeText={(text) => setFormData({...formData, monedaDefault: text})}
                placeholder="ARS"
              />
            </View>
          </View>

          {/* Configuraciones de Sistema */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Configuraciones de Sistema</Text>
            
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Notificaciones Activas</Text>
                <Text style={styles.switchDescription}>Recibir notificaciones de movimientos</Text>
              </View>
              <Switch
                value={formData.notificacionesActivas}
                onValueChange={(value) => setFormData({...formData, notificacionesActivas: value})}
                trackColor={{ false: '#ccc', true: '#007BFF' }}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Requiere Aprobación</Text>
                <Text style={styles.switchDescription}>Los empleados necesitan aprobación para egresos grandes</Text>
              </View>
              <Switch
                value={formData.requiereAprobacion}
                onValueChange={(value) => setFormData({...formData, requiereAprobacion: value})}
                trackColor={{ false: '#ccc', true: '#007BFF' }}
              />
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 Acciones</Text>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={guardarConfiguracion}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="save" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Guardar Configuración</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.resetButton]}
              onPress={resetearConfiguracion}
            >
              <Feather name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Resetear a Defaults</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.logoutButton]}
              onPress={confirmarCerrarSesion}
            >
              <Feather name="log-out" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchInfo: {
    flex: 1,
    marginRight: 15,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  switchDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  resetButton: {
    backgroundColor: '#ffc107',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
