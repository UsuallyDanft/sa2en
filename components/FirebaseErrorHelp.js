import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

const FirebaseErrorHelp = ({ errorCode, onClose }) => {
  const getHelpContent = () => {
    switch (errorCode) {
      case 'auth/operation-not-allowed':
        return {
          title: 'Error de Configuración de Firebase',
          description: 'El registro con email/password no está habilitado en tu proyecto de Firebase.',
          steps: [
            '1. Ve a Firebase Console (https://console.firebase.google.com)',
            '2. Selecciona tu proyecto: sa2en-app',
            '3. Ve a Authentication > Sign-in method',
            '4. Habilita "Email/Password"',
            '5. Guarda los cambios'
          ],
          actionText: 'Abrir Firebase Console',
          actionUrl: 'https://console.firebase.google.com/project/sa2en-app/authentication/providers'
        };
      
      case 'auth/network-request-failed':
        return {
          title: 'Error de Conexión',
          description: 'No se pudo conectar con Firebase. Verifica tu conexión a internet.',
          steps: [
            '1. Verifica tu conexión a internet',
            '2. Intenta nuevamente',
            '3. Si el problema persiste, contacta al administrador'
          ],
          actionText: null
        };
      
      default:
        return {
          title: 'Error de Firebase',
          description: 'Ha ocurrido un error inesperado con Firebase.',
          steps: [
            '1. Verifica tu conexión a internet',
            '2. Reinicia la aplicación',
            '3. Si el problema persiste, contacta al administrador'
          ],
          actionText: null
        };
    }
  };

  const content = getHelpContent();

  const handleAction = () => {
    if (content.actionUrl) {
      Linking.openURL(content.actionUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="alert-triangle" size={24} color="#FF6B6B" />
        <Text style={styles.title}>{content.title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Feather name="x" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>{content.description}</Text>
      
      <View style={styles.stepsContainer}>
        {content.steps.map((step, index) => (
          <Text key={index} style={styles.step}>{step}</Text>
        ))}
      </View>
      
      {content.actionText && (
        <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
          <Text style={styles.actionButtonText}>{content.actionText}</Text>
          <Feather name="external-link" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  stepsContainer: {
    marginBottom: 16,
  },
  step: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FirebaseErrorHelp; 