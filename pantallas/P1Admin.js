import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function PantallaDeInicio() {
  
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../assets/Fondo2.png')} style={styles.container}>
      
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

      <View style={styles.formContainer}>


        {/* Recuperar contraseña alineado más a la derecha */}
        <View style={styles.recoverContainer}>
          <Text style={styles.recoverText}>¡Bienvenido, Enmanuel!</Text>
        </View>


                {/* Registro alineado debajo del botón */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>La app de SA2EN, es una herramienta diseñada para facilitar y agilizar el control de caja chica de tus obras. Para comenzar crea tu primer registro haciendo click en el siguiente botón.</Text>
        </View>


        {/* Botón de Iniciar Sesión */}
        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    width: '100%',
    height: 377, // Ajusta según el tamaño de tu imagen
    resizeMode: 'cover',
  },

  logo: { 
    width: 150,
    height: 90,
    resizeMode: 'center',
    marginBottom: 10,
  },

  formContainer: {
    width: '85%',
    height: 440,
    padding: 20,
    marginTop: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },
 
  recoverContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 70,
    marginTop: 15,
  },

  recoverText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },

  button: {
    width: '100%',
    backgroundColor: '#FF7E22',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 15,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    padding: 15,
  },

  registerText: {
    fontSize: 16,
    textAlign: 'justify',
    color: '#000',
  },

});
