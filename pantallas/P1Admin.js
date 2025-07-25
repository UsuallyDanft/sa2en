// P1Admin.js
import { View, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// 1. Importa tus estilos desde el archivo con el nuevo nombre
import { styles } from '../estilos/EstilosP1Admin.js';

// 2. Usa el nombre correcto para tu componente
export default function P1Admin() { 
  const navigation = useNavigation();

  return (
    <ImageBackground 
      source={require('../assets/Fondo2.jpg')} 
      style={styles.background}
      resizeMode="cover" 
    >
      
      <Image 
        source={require('../assets/Logo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />

      <View style={styles.formContainer}>

        <Text style={styles.welcomeText}>¡Bienvenido, Enmanuel!</Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            La app de SA2EN es una herramienta diseñada para facilitar y agilizar el control de caja chica de tus obras. Para comenzar, crea tu primer registro.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Registro')}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}