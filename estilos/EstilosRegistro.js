import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },

  logo: {
    width: 150,
    height: 90,
    resizeMode: 'center',
    marginBottom: 10,
  },

  formContainer: {
    width: '85%',
    height: 550,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },

  inputNombreR: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },

  inputentidadI: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },

  inputNombreE: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    width: '100%',
  },

  picker: {
    flex: 1,
    height: 47,
    paddingHorizontal: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },

  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },

  errorMessage: {
    marginTop: 5,
  },

  inputFocused: {
    borderColor: '#FFA500',
  },

  labelText: {
    fontSize: 14,
    color: '#000',
    marginRight: 10,
    backgroundColor: 'transparent',
  },

  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },

  dateInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
  },

  calendarButton: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  button: {
    width: '100%',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  successContainer: {
    flex: 1,
    width: '85%',
    height: 440,
    justifyContent: 'center',
    alignItems: 'center',
  },

  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },

  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },

  newButton: {
    width: '100%',
    backgroundColor: '#FF7E22',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
  },

  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
