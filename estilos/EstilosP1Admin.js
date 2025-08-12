import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 80,
  },
  logoutButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 50,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: width > 400 ? 28 : 24,
    fontWeight: 'bold',
    color: '#fafafa',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    flexWrap: 'wrap',
  },
  roleText: {
    fontSize: width > 400 ? 16 : 14,
    color: '#fafafa',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
    paddingHorizontal: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(250, 250, 250, 0.95)',
    borderRadius: 15,
    padding: width > 400 ? 20 : 15,
    marginBottom: 30,
    width: width * 0.90,
    maxWidth: 400,
    minHeight: 100,
  },
  descriptionText: {
    fontSize: width > 400 ? 16 : 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: width > 400 ? 24 : 20,
    flexWrap: 'wrap',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width > 400 ? 15 : 12,
    paddingHorizontal: width > 400 ? 40 : 30,
    minWidth: 200,
    maxWidth: width * 0.8,
    borderRadius: 25,
    minWidth: 200,
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#007BFF',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: 'bold',
  },
});