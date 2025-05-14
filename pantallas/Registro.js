import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Image, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'

export default function PantallaDeRegistros() {
  const [registro, setRegistro] = useState('Selecciona');
  const [nombreR, setNombreR] = useState('');
  const [entidad, setEntidad] = useState('Opciones');
  const [entidadI, setEntidadI] = useState('');
  const [nombreE, setNombreE] = useState('');
  const [lugar, setLugar] = useState('');  
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showOtherEntityInput, setShowOtherEntityInput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [nombreRFocused, setNombreRFocused] = useState(false);
  const [entidadIFocused, setEntidadIFocused] = useState(false);
  const [nombreEFocused, setNombreEFocused] = useState(false);
  const [lugarFocused, setLugarFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  }

  const registroNuevo = () => {
    if (!nombreR.trim() || !lugar.trim() || !nombreE.trim() || (entidad === "Otro" && !entidadI.trim())) {
      setErrorMessage('Por favor, complete todos los campos.')
      return;
    }
    
    setErrorMessage('')
    setIsSaved(true)
  }

  const irACajaChica = () => {
    navigation.navigate('Cajachica');
  }

  return (
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

        {!isSaved ? (
          <>
            {/* Selector de Tipo de Registro*/}
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

            {/* Input del nombre de registro */}
            <TextInput
              style={[styles.inputNombreR, nombreRFocused && styles.inputFocused]}
              placeholder="Nombre del registro"
              value={nombreR}
              onChangeText={setNombreR}
              onFocus={() => setNombreRFocused(true)}
              onBlur={() => setNombreRFocused(false)}
            />

            {/* Select de la entidad*/}
            <View style={styles.row}>
              <Text style={styles.labelText}>Entidad</Text>
              <Picker
                selectedValue={entidad}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setEntidad(itemValue);
                  setShowOtherEntityInput(itemValue === "Otro");
                  if (itemValue !== "Otro") setEntidadI("");
                }}
              >
                <Picker.Item label="Empresa privada" value="Empresa privada" />
                <Picker.Item label="Municipalidad" value="Municipalidad" />
                <Picker.Item label="Gobierno Regional" value="Gobierno Regional" />
                <Picker.Item label="Otro" value="Otro" />
              </Picker>
            </View>

            {/* Input entidad (solo aparece si selecciona Otro) */}
            {showOtherEntityInput && (
              <TextInput
                style={[styles.inputentidadI, entidadIFocused && styles.inputFocused]}
                placeholder="Entidad"
                value={entidadI}
                onChangeText={setEntidadI}
                onFocus={() => setEntidadIFocused(true)}
                onBlur={() => setEntidadIFocused(false)}
              />
            )}

            {/* Input de Nombre de la entidad */}
            <TextInput
              style={[styles.inputNombreE, nombreEFocused && styles.inputFocused]}
              placeholder="Nombre de la entidad"
              value={nombreE}
              onChangeText={setNombreE}
              onFocus={() => setNombreEFocused(true)}
              onBlur={() => setNombreEFocused(false)}
            />


            {/* Input de lugar */}
            <TextInput
              style={[styles.input, lugarFocused && styles.inputFocused]}
              placeholder="Lugar"
              value={lugar}
              onChangeText={setLugar}
              onFocus={() => setLugarFocused(true)}
              onBlur={() => setLugarFocused(false)}
            />

            {/* Selector de fecha con icono de calendario */}
            <View style={styles.dateContainer}>
              <TextInput
                style={styles.dateInput}
                value={date.toLocaleDateString()}
                editable={false}
                placeholder="Seleccionar fecha"
              />
              <TouchableOpacity 
                style={styles.calendarButton}
                onPress={() => setShowDatePicker(true)}>
                <Feather name="calendar" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={registroNuevo}>
              <Text style={styles.buttonText}>Guardar Registro</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>¡Registro guardado exitosamente!</Text>
            <Text style={styles.instructionText}>Para continuar y crear tu primera caja chica, presiona el botón a continuación.</Text>
            <TouchableOpacity style={styles.newButton} onPress={irACajaChica}>
              <Text style={styles.newButtonText}>Caja Chica</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DateTimePicker fuera del formContainer */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
    </ImageBackground>
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

  inputentidadI:{
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