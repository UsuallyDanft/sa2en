import React, { useState } from 'react';
import { View, TextInput, ImageBackground, Image, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../estilos/EstilosRegistro';

// 1. --- IMPORTACIONES DE FIREBASE ---
import { auth, db } from '../FirebaseConf'; // Asegúrate que la ruta a tu config de Firebase sea correcta
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PantallaDeRegistros() {
  const [registro, setRegistro] = useState('Obra'); // Valor inicial coherente
  const [nombreR, setNombreR] = useState('');
  const [entidad, setEntidad] = useState('Empresa privada'); // Valor inicial coherente
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
  };

  // 2. --- FUNCIÓN MODIFICADA PARA GUARDAR EN FIRESTORE ---
  const registroNuevo = async () => {
    // Validación de campos
    if (!nombreR.trim() || !lugar.trim() || !nombreE.trim() || (entidad === "Otro" && !entidadI.trim())) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    // Obtener el usuario actual
    const user = auth.currentUser;
    if (!user) {
      setErrorMessage('No hay un usuario autenticado. Por favor, inicie sesión.');
      return;
    }

    setErrorMessage('');

    // Preparar el objeto de datos que se guardará
    const dataParaGuardar = {
      userId: user.uid, // Guardar el ID del usuario para referencia
      tipoRegistro: registro,
      nombreRegistro: nombreR,
      tipoEntidad: entidad === 'Otro' ? entidadI : entidad,
      nombreEntidad: nombreE,
      lugar: lugar,
      fecha: date, // Firestore maneja objetos Date de JavaScript
      creadoEn: serverTimestamp() // Añade una marca de tiempo del servidor
    };

    try {
      // Crear una referencia a la subcolección 'registro' del usuario
      // La ruta será: users/{ID_DEL_USUARIO}/registro/{ID_DEL_DOCUMENTO}
      const docRef = await addDoc(collection(db, 'gerentes', user.uid, 'registro'), dataParaGuardar);
      console.log("Documento guardado con ID: ", docRef.id);
      setIsSaved(true); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al guardar el registro en Firestore: ", error);
      setErrorMessage('Error al guardar los datos. Intente nuevamente.');
    }
  };

  const irACajaChica = () => {
    navigation.navigate('Cajachica');
  };

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
                    placeholder="Especifique la entidad"
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
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
/* los comentarios son asi */