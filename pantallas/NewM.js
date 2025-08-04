
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Feather from '@expo/vector-icons/Feather';
import { db, serverTimestamp } from '../FirebaseConf';
import { addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function NewM() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = useAuth();
  const tipo = route.params?.tipo || 'ingreso';

  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    categoria: '',
    responsable: userProfile?.nombre || ''
  });

  const [loading, setLoading] = useState(false);
  const [montoFocused, setMontoFocused] = useState(false);
  const [descripcionFocused, setDescripcionFocused] = useState(false);
  const [responsableFocused, setResponsableFocused] = useState(false);

  const categorias = {
    ingreso: [
      'Ventas',
      'Servicios',
      'Comisiones',
      'Intereses',
      'Otros ingresos'
    ],
    egreso: [
      'Compras',
      'Gastos operativos',
      'Servicios públicos',
      'Transporte',
      'Mantenimiento',
      'Suministros',
      'Otros gastos'
    ]
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      categoria: categorias[tipo][0]
    }));
  }, [tipo]);

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.monto || !formData.descripcion || !formData.responsable) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    const monto = parseFloat(formData.monto);
    if (isNaN(monto) || monto <= 0) {
      Alert.alert('Error', 'Por favor ingrese un monto válido mayor a 0');
      return;
    }

    try {
      setLoading(true);

      const movimientoData = {
        tipo: tipo,
        monto: monto,
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        responsable: formData.responsable.trim(),
        fecha: serverTimestamp(),
        usuario: userProfile?.email || 'usuario@test.com',
        activo: true
      };

      await addDoc(collection(db, 'movimientos'), movimientoData);

      Alert.alert(
        'Éxito',
        `${tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} registrado correctamente`,
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      Alert.alert('Error', 'No se pudo registrar el movimiento. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (text) => {
    // Remover caracteres no numéricos excepto punto decimal
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Permitir solo un punto decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    
    return cleaned;
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>
            Nuevo {tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
          </Text>
          <Feather 
            name={tipo === 'ingreso' ? 'plus-circle' : 'minus-circle'} 
            size={24} 
            color={tipo === 'ingreso' ? '#28a745' : '#dc3545'} 
          />
        </View>

        <ScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Tipo de movimiento indicator */}
            <View style={[
              styles.tipoIndicator, 
              { backgroundColor: tipo === 'ingreso' ? '#d4edda' : '#f8d7da' }
            ]}>
              <Feather 
                name={tipo === 'ingreso' ? 'trending-up' : 'trending-down'} 
                size={20} 
                color={tipo === 'ingreso' ? '#28a745' : '#dc3545'} 
              />
              <Text style={[
                styles.tipoText,
                { color: tipo === 'ingreso' ? '#155724' : '#721c24' }
              ]}>
                {tipo === 'ingreso' ? 'INGRESO' : 'EGRESO'}
              </Text>
            </View>

            {/* Campo de monto */}
            <Text style={styles.label}>Monto *</Text>
            <View style={styles.montoContainer}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                style={[
                  styles.montoInput,
                  montoFocused && styles.inputFocused
                ]}
                placeholder="0.00"
                value={formData.monto}
                onChangeText={(text) => {
                  const formatted = formatCurrency(text);
                  setFormData({...formData, monto: formatted});
                }}
                onFocus={() => setMontoFocused(true)}
                onBlur={() => setMontoFocused(false)}
                keyboardType="numeric"
              />
            </View>

            {/* Campo de descripción */}
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[
                styles.textArea,
                descripcionFocused && styles.inputFocused
              ]}
              placeholder="Describa el motivo del movimiento..."
              value={formData.descripcion}
              onChangeText={(text) => setFormData({...formData, descripcion: text})}
              onFocus={() => setDescripcionFocused(true)}
              onBlur={() => setDescripcionFocused(false)}
              multiline
              numberOfLines={3}
            />

            {/* Campo de categoría */}
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.categoria}
                onValueChange={(itemValue) => 
                  setFormData({...formData, categoria: itemValue})
                }
                style={styles.picker}
              >
                {categorias[tipo].map((cat, index) => (
                  <Picker.Item key={index} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            {/* Campo de responsable */}
            <Text style={styles.label}>Responsable *</Text>
            <TextInput
              style={[
                styles.input,
                responsableFocused && styles.inputFocused
              ]}
              placeholder="Nombre del responsable"
              value={formData.responsable}
              onChangeText={(text) => setFormData({...formData, responsable: text})}
              onFocus={() => setResponsableFocused(true)}
              onBlur={() => setResponsableFocused(false)}
            />

            {/* Resumen */}
            <View style={styles.resumenContainer}>
              <Text style={styles.resumenTitle}>Resumen</Text>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Tipo:</Text>
                <Text style={[
                  styles.resumenValue,
                  { color: tipo === 'ingreso' ? '#28a745' : '#dc3545' }
                ]}>
                  {tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                </Text>
              </View>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Monto:</Text>
                <Text style={styles.resumenValue}>
                  ${formData.monto || '0.00'}
                </Text>
              </View>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Categoría:</Text>
                <Text style={styles.resumenValue}>{formData.categoria}</Text>
              </View>
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  { backgroundColor: tipo === 'ingreso' ? '#28a745' : '#dc3545' },
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="save" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Guardar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tipoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  tipoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  montoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 10,
  },
  montoInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputFocused: {
    borderColor: '#007BFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  resumenContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  resumenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  resumenLabel: {
    fontSize: 14,
    color: '#666',
  },
  resumenValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
