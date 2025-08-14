import React, { useState } from 'react'
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Switch, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../FirebaseConf'

export default function PantallaDeRegistros() {
  const [nombreC, setNombreC] = useState('')
  const [registro, setRegistro] = useState('Obra')
  const [nombreS, setNombreS] = useState('')
  const [formaE, setFormaE] = useState('')
  const [monto, setMonto] = useState('')
  const [switchS, setSwitchS] = useState(false)
  const [cajainput, setCajainput] = useState('')

  const [nombreCFocused, setNombreCFocused] = useState(false)
  const [nombreSFocused, setNombreSFocused] = useState(false)
  const [formaEFocused, setFormaEFocused] = useState(false)
  const [montoFocused, setMontoFocused] = useState(false)
  const [cajainputFocused, setCajainputFocused] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigation = useNavigation()

  // Determina la subcolección según el tipo de registro
  const getSubcoleccion = (tipo) => {
    if (tipo === 'Obra') return 'Robra'
    if (tipo === 'Servicios') return 'Rservicios'
    if (tipo === 'Bienes') return 'Rbienes'
    return 'registro'
  }

  const registroNuevo = async () => {
    if (!nombreC.trim() || !nombreS.trim() || !formaE.trim() || !monto.trim()) {
      setErrorMessage('Por favor, complete todos los campos.')
      return
    }
    setErrorMessage('')

    const user = auth.currentUser
    if (!user) {
      setErrorMessage('No hay un usuario autenticado. Por favor, inicie sesión.')
      return
    }

    let montoFinal = parseFloat(monto)
    // Si el switch está activo, buscar la caja anterior y sumar su monto
    if (switchS && cajainput.trim()) {
      try {
        const subcoleccion = getSubcoleccion(registro)
        const cajasChicasRef = collection(db, 'gerentes', user.uid, subcoleccion, nombreS, 'cajas_chicas')
        const q = query(cajasChicasRef, where('nombreCaja', '==', cajainput.trim()))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          const cajaAnterior = querySnapshot.docs[0].data()
          montoFinal += parseFloat(cajaAnterior.monto) || 0
        } else {
          setErrorMessage('No se encontró la caja anterior con ese nombre.')
          return
        }
      } catch (error) {
        setErrorMessage('Error al buscar la caja anterior.')
        return
      }
    }

    // Guardar la nueva caja chica
    try {
      const subcoleccion = getSubcoleccion(registro)
      const cajasChicasRef = collection(db, 'gerentes', user.uid, subcoleccion, nombreS, 'cajas_chicas')
      await addDoc(cajasChicasRef, {
        nombreCaja: nombreC,
        nombreServicio: nombreS,
        formaEntrega: formaE,
        monto: montoFinal,
        creadoEn: serverTimestamp()
      })
      setErrorMessage('')
      setNombreC('')
      setNombreS('')
      setFormaE('')
      setMonto('')
      setCajainput('')
      setSwitchS(false)
      alert('Caja chica guardada con éxito')
    } catch (error) {
      setErrorMessage('Error al guardar la caja chica.')
    }
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

            {/* Picker de tipo de registro */}
            <View style={styles.row}>
              <Text style={styles.labelText}>Tipo de Registro</Text>
              <Picker
                selectedValue={registro}
                style={styles.picker}
                onValueChange={(itemValue) => setRegistro(itemValue)}
              >
                <Picker.Item label="Obra" value="Obra" />
                <Picker.Item label="Servicios" value="Servicios" />
                <Picker.Item label="Bienes" value="Bienes" />
              </Picker>
            </View>

            <TextInput
              style={[styles.input, nombreSFocused && styles.inputFocused]}
              placeholder="Nombre del registro"
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

            {/* Input para el monto */}
            <TextInput
              style={[styles.input, montoFocused && styles.inputFocused]}
              placeholder="Monto"
              value={monto}
              onChangeText={setMonto}
              onFocus={() => setMontoFocused(true)}
              onBlur={() => setMontoFocused(false)}
              keyboardType="numeric"
            />

            {/* Switch para caja anterior */}
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

            {/* Input para buscar caja anterior solo si el switch está activo */}
            {switchS && (
              <TextInput
                style={[styles.input, cajainputFocused && styles.inputFocused]}
                placeholder="Nombre de la caja anterior"
                value={cajainput}
                onChangeText={setCajainput}
                onFocus={() => setCajainputFocused(true)}
                onBlur={() => setCajainputFocused(false)}
              />
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