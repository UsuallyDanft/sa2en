import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';

export default function Menu() {
  const navigation = useNavigation();
  const { userRole, userProfile, logout } = useAuth();

  const menuItems = [
    {
      title: 'Principal',
      subtitle: 'Pantalla principal',
      icon: 'home',
      screen: 'Principal',
      color: '#007BFF',
      available: true
    },
    {
      title: 'Registros',
      subtitle: 'Crear nuevo registro',
      icon: 'plus-circle',
      screen: 'Registro',
      color: '#28a745',
      available: true
    },
    {
      title: 'Caja Chica',
      subtitle: 'Gestionar caja chica',
      icon: 'dollar-sign',
      screen: 'Cajachica',
      color: '#ffc107',
      available: true
    },
    {
      title: 'Movimientos',
      subtitle: 'Ver historial',
      icon: 'list',
      screen: 'Movimientos',
      color: '#17a2b8',
      available: true
    },
    {
      title: 'Equipo',
      subtitle: 'Gestionar empleados',
      icon: 'users',
      screen: 'Equipo',
      color: '#6f42c1',
      available: true
    },
    {
      title: 'Configuración',
      subtitle: 'Ajustes del sistema',
      icon: 'settings',
      screen: 'Configuracion',
      color: '#fd7e14',
      available: userRole === 'gerente'
    }
  ];

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Menú Principal</Text>
        <TouchableOpacity onPress={confirmarCerrarSesion}>
          <Feather name="log-out" size={24} color="#dc3545" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>{userProfile?.nombre || 'Usuario'}</Text>
          <Text style={styles.userRole}>
            {userRole === 'gerente' ? 'Gerente' : `Empleado - ${userProfile?.puesto}`}
          </Text>
          {userProfile?.email && (
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          )}
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems
            .filter(item => item.available)
            .map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Feather name={item.icon} size={32} color="#fff" />
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>SA2EN App</Text>
          <Text style={styles.appVersion}>Versión 1.0.0</Text>
          <Text style={styles.appDescription}>
            Sistema de gestión de caja chica para obras
          </Text>
        </View>
      </ScrollView>
    </View>
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
  scrollContainer: {
    padding: 20,
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  appInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});