
import React from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../estilos/EstilosP1Admin.js';

export default function P1Admin() { 
  const navigation = useNavigation();
  const { userProfile, userRole, logout } = useAuth();

  return (
    <ImageBackground 
      source={require('../assets/Fondo2.jpg')} 
      style={styles.background}
      resizeMode="cover" 
    >
      
      <View style={styles.header}>
        <Image 
          source={require('../assets/Logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>
          ¡Bienvenido, {userProfile?.nombre || 'Usuario'}!
        </Text>
        
        <Text style={styles.roleText}>
          {userRole === 'gerente' ? 'Gerente' : `Empleado - ${userProfile?.puesto}`}
        </Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            La app de SA2EN es una herramienta diseñada para facilitar y agilizar el control de caja chica de tus obras. 
            {userRole === 'gerente' ? ' Como gerente, puedes gestionar empleados y crear registros.' : ' Para comenzar, crea tu primer registro.'}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Registro')}
          >
            <Feather name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Comenzar</Text>
          </TouchableOpacity>

          {userRole === 'gerente' && (
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Configuracion')}
            >
              <Feather name="settings" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Configuración</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
