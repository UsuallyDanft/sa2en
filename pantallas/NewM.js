
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { db, serverTimestamp } from '../FirebaseConf';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Feather from '@expo/vector-icons/Feather';

export default function NuevoMovimiento() {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [categoria, setCategoria] = useState('alimentacion');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigation = useNavigation();
  const { user } = useAuth();

  const categorias = {
    gasto: [
      { label: 'Alimentación', value: 'alimentacion' },
      { label: 'Transporte', value: 'transporte' },
      { label: 'Materiales', value: 'materiales' },
      { label: 'Servicios', value: 'servicios' },
      { label: 'Equipo', value: 'equipo' },
      { label: 'Otros gastos', value: 'otros_gastos' }
    ],
    ingreso: [
      { label: 'Ventas', value: 'ventas' },
      { label: 'Servicios', value: 'servicios_ingreso' },
      { label: 'Reembolsos', value: 'reembolsos' },
      { label: 'Otros ingresos', value: 'otros_ingresos' }
    ]
  };

  const handleSubmit = async () => {
    if (!descripcion.trim() || !monto.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      setErrorMessage('Ingrese un monto válido mayor a 0.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'movimientos'), {
        descripcion: descripcion.trim(),
        monto: montoNumerico,
        tipo,
        categoria,
        fecha: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email
      });

      Alert.alert('Éxito', 'Movimiento registrado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      setErrorMessage('Error al guardar el movimiento. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Nuevo Movimiento</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Tipo de Movimiento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Movimiento</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => {
                  setTipo('gasto');
                  setCategoria('alimentacion');
                }}
              >
                <View style={[styles.radioCircle, tipo === 'gasto' && styles.radioSelected]}>
                  {tipo === 'gasto' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Gasto</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => {
                  setTipo('ingreso');
                  setCategoria('ventas');
                }}
              >
                <View style={[styles.radioCircle, tipo === 'ingreso' && styles.radioSelected]}>
                  {tipo === 'ingreso' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Ingreso</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Almuerzo para el equipo"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Monto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto (S/)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
            />
          </View>

          {/* Categoría */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoria}
                style={styles.picker}
                onValueChange={setCategoria}
              >
                {categorias[tipo].map((cat) => (
                  <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Guardando...' : 'Guardar Movimiento'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#4CAF50',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
