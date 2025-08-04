import React, { useState } from 'react';
import { View, TextInput, ImageBackground, Image, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../estilos/EstilosRegistro';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../FirebaseConf';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreObra: '',
    cliente: '',
    ubicacion: '',
    fechaInicio: '',
    presupuestoInicial: '',
    descripcion: '',
    estado: 'En Progreso'
  });

  const [focusedInput, setFocusedInput] = useState('');

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const registroNuevo = () => {
    if (!nombreR.trim() || !lugar.trim() || !nombreE.trim() || (entidad === "Otro" && !entidadI.trim())) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    setErrorMessage('');
    setIsSaved(true);
  };

  const irACajaChica = () => {
    navigation.navigate('Cajachica');
  };

  const handleSubmit = async () => {
    if (!formData.nombreObra || !formData.cliente || !formData.ubicacion) {
      Alert.alert('Error', 'Por favor complete los campos obligatorios (Nombre de obra, Cliente y Ubicación)');
      return;
    }

    setLoading(true);
    try {
      const registroData = {
        ...formData,
        fechaInicio: formData.fechaInicio || new Date().toISOString().split('T')[0],
        presupuestoInicial: parseFloat(formData.presupuestoInicial) || 0,
        fechaCreacion: serverTimestamp(),
        creadoPor: userProfile?.email || 'Usuario desconocido',
        creadorNombre: userProfile?.nombre || 'Usuario',
        montoGastado: 0,
        movimientos: []
      };

      await addDoc(collection(db, 'registros'), registroData);

      Alert.alert(
        'Éxito',
        'Registro de obra creado correctamente',
        [
          {
            text: 'Ver Registros',
            onPress: () => navigation.navigate('Principal')
          },
          {
            text: 'Crear Otro',
            onPress: () => {
              setFormData({
                nombreObra: '',
                cliente: '',
                ubicacion: '',
                fechaInicio: '',
                presupuestoInicial: '',
                descripcion: '',
                estado: 'En Progreso'
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al crear registro:', error);
      Alert.alert('Error', 'No se pudo crear el registro de obra');
    } finally {
      setLoading(false);
    }
  };

  const menuOptions = [
    {
      title: 'Caja Chica',
      subtitle: 'Gestionar movimientos',
      icon: 'dollar-sign',
      screen: 'Cajachica',
      color: '#28a745'
    },
    {
      title: 'Movimientos',
      subtitle: 'Ver historial',
      icon: 'list',
      screen: 'Movimientos',
      color: '#007BFF'
    },
    {
      title: 'Equipo',
      subtitle: 'Gestionar empleados',
      icon: 'users',
      screen: 'Equipo',
      color: '#6f42c1'
    },
    {
      title: 'Menú',
      subtitle: 'Más opciones',
      icon: 'menu',
      screen: 'Menu',
      color: '#fd7e14'
    }
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/Fondo1.png')}
            style={styles.container}
          >
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}