import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native'


// Importación de las pantallas de navegación
import {useNavigation} from '@react-navigation/native'

export default function Principal() {
  // Se accede a la navegación para poder navegar a la pantalla de Registrar
  const navigation = useNavigation()

  return (
    <ImageBackground 
      source={require('../assets/Fondo1.png')} // La imagen de fondo en la carpeta assets
      style={styles.container} // Estilos para la pantalla
    >
         /* Logo */
      <Image 
        source={require('../assets/Logo.png')} 
        style={styles.logo} // Para dar estilos al logo
      />

      /* Botón para Iniciar sesión */
      <TouchableOpacity style={styles.button}
      onPress={() => navigation.navigate('Inicio')} >
      <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      /* Texto con enlace a la pantalla de Registrar */
      <View style={styles.registerTextContainer}>
        <Text style={styles.text}>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
          <Text style={styles.registerLink}>Regístrate</Text> 
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

/*Estilos de la pantalla*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 190, // Tamaño más pequeño
    height: 100,
    resizeMode: 'center',
    marginBottom: 350,
  },


  button: {
    backgroundColor: 'rgba(166, 200, 252, 0.21)', // Color de fondo con opacidad (HEX A6C8FC y 21% de  transparencia)
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 30,
    marginBottom: 20, // Separación entre el botón y el texto
  },
  buttonText: {
    color: '#FFFFFF', // Color de texto del botón (blanco)
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  registerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF', // Color blanco para el texto
    fontSize: 16,
  },
  registerLink: {
    color: '#FF7E22', // Color para el texto del enlace (HEX 0622AC)
    fontSize: 16,
  },
})
