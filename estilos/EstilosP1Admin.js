// p1AdminStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },


  logo: { 
    width: 150,
    height: 90,
    marginBottom: 20,
  },

  formContainer: {
    width: '85%',
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  welcomeText: { // Renombrado para ser más genérico
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },

  descriptionContainer: { // Renombrado
    marginBottom: 20,
  },

  descriptionText: { // Renombrado
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },

  button: {
    width: '100%',
    backgroundColor: '#FF7E22',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});