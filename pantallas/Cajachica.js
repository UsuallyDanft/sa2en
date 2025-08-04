import React, { useState } from 'react'
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Switch, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Feather from '@expo/vector-icons/Feather'
import { Picker } from '@react-native-picker/picker'

export default function PantallaDeRegistros() {
  const [nombreC, setNombreC] = useState('')
  const [nombreS, setNombreS] = useState('')
  const [formaE, setFormaE] = useState('')  
  const [registro, setRegistro] = useState('Selecciona')
  const [switchS, setSwitchS] = useState(false)
  const [cajainput, setCajainput] = useState('')

  const [nombreCFocused, setNombreCFocused] = useState(false)
  const [nombreSFocused, setNombreSFocused] = useState(false)
  const [formaEFocused, setFormaEFocused] = useState(false)
  const [cajainputFocused, setCajainputFocused] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigation = useNavigation()

  const registroNuevo = () => {
    if (!nombreC.trim() || !nombreS.trim() || !formaE.trim()) {
      setErrorMessage('Por favor, complete todos los campos.')
      return
    }
    setErrorMessage('')
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../assets/Fondo1.png')}
          style={styles.container}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} />

          <View style={styles.formContainer}>
        <View style={styles.errorMessage}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        <TextInput
          style={[styles.inputNombreC, nombreCFocused && styles.inputFocused]}
          placeholder="Nombre de la caja"
          value={nombreC}
          onChangeText={setNombreC}
          onFocus={() => setNombreCFocused(true)}
          onBlur={() => setNombreCFocused(false)}
        />
        
        <TextInput
          style={[styles.input, nombreSFocused && styles.inputFocused]}
          placeholder="Nombre del servicio"
          value={nombreS}
          onChangeText={setNombreS}
          onFocus={() => setNombreSFocused(true)}
          onBlur={() => setNombreSFocused(false)}
        />

        <TextInput
          style={[styles.inputFormaE, formaEFocused && styles.inputFocused]}
          placeholder="Forma de entrega"
          value={formaE}
          onChangeText={setFormaE}
          onFocus={() => setFormaEFocused(true)}
          onBlur={() => setFormaEFocused(false)}
        />

        {/* Switch modificado para que esté a la derecha con el estado */}
        <View style={styles.switchContainer}>
          <View style={styles.switchContent}>
            <View style={styles.switchLabels}>
              <Text style={styles.switchMainLabel}>¿Hay fondos de una</Text>
              <Text style={styles.switchMainLabel}>caja anterior?</Text>
            </View>
            <View style={styles.switchRightSection}>
              <Text style={styles.switchStateText}>
                {switchS ? 'Sí' : 'No'}
              </Text>
              <Switch
                value={switchS}
                onValueChange={setSwitchS}
                trackColor={{ false: "#e0e0e0", true: "#1E90FF" }}
                thumbColor={"#FFFFFF"}
                style={styles.customSwitch}
              />
            </View>
          </View>
        </View>

        {switchS && (
          <>
            <View style={styles.row}>
              <Text style={styles.labelText}>Tipo de Registro</Text>
              <Picker
                selectedValue={registro}
                style={styles.picker}
                onValueChange={(itemValue) => setRegistro(itemValue)}
                enabled={switchS}
              >
                <Picker.Item label="Obra" value="Obra" />
                <Picker.Item label="Servicios" value="Servicios" />
                <Picker.Item label="Bienes" value="Bienes" />
              </Picker>
            </View>

            <TextInput
              style={[styles.input, cajainputFocused , !switchS && styles.inputcaja]}
              placeholder="Nombre de la caja"
              value={cajainput}
              onChangeText={setCajainput}
              onFocus={() => setCajainputFocused(true)}
              onBlur={() => setCajainputFocused(false)}
              editable={switchS}
            />
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={registroNuevo}>
          <Text style={styles.buttonText}>Guardar Registro</Text>
        </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

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
    height: 490, 
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
  },
  inputNombreC: { 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },
  inputFormaE: { 
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
    marginTop: 10,
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
  inputcaja: {
    backgroundColor: '#e0e0e0',
    color: '#a0a0a0',
  },
  switchContainer: {
    width: '100%',
    marginVertical: 15,
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  switchLabels: {
    flexDirection: 'column',
    marginLeft: 20,
  },
  switchRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchMainLabel: {
    fontSize: 14,
    color: '#000',
    lineHeight: 18,
  },
  switchStateText: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  customSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
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
})