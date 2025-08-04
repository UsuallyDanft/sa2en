
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Feather from '@expo/vector-icons/Feather';

export default function Principal() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Inicio');
  };

  const menuItems = [
    {
      title: 'Caja Chica',
      subtitle: 'Gestionar fondos y gastos menores',
      icon: 'dollar-sign',
      color: '#4CAF50',
      onPress: () => navigation.navigate('Cajachica')
    },
    {
      title: 'Movimientos',
      subtitle: 'Ver historial de transacciones',
      icon: 'activity',
      color: '#2196F3',
      onPress: () => navigation.navigate('Movimientos')
    },
    {
      title: 'Registros',
      subtitle: 'Crear nuevos registros de obra',
      icon: 'file-plus',
      color: '#FF9800',
      onPress: () => navigation.navigate('Registro')
    },
    {
      title: 'Equipo',
      subtitle: 'Gestionar miembros del equipo',
      icon: 'users',
      color: '#9C27B0',
      onPress: () => navigation.navigate('Equipo')
    },
    {
      title: 'Configuración',
      subtitle: 'Ajustes de la aplicación',
      icon: 'settings',
      color: '#607D8B',
      onPress: () => navigation.navigate('Configuracion')
    }
  ];

  return (
    <ImageBackground
      source={require('../assets/Fondo1.png')}
      style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} />
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              onPress={item.onPress}
            >
              <Feather name={item.icon} size={40} color="#fff" />
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  menuSubtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    opacity: 0.9,
  },
});
