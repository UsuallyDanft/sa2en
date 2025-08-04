
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { db } from '../FirebaseConf';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

export default function Cajachica() {
  const navigation = useNavigation();
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saldoTotal, setSaldoTotal] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'movimientos'),
      orderBy('fecha', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const movimientosData = [];
      let saldo = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        movimientosData.push({
          id: doc.id,
          ...data,
        });
        
        // Calcular saldo
        if (data.tipo === 'ingreso') {
          saldo += parseFloat(data.monto || 0);
        } else {
          saldo -= parseFloat(data.monto || 0);
        }
      });

      setMovimientos(movimientosData);
      setSaldoTotal(saldo);
      setLoading(false);
    }, (error) => {
      console.error('Error al obtener movimientos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Sin fecha';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-AR');
  };

  const renderMovimiento = ({ item }) => (
    <View style={styles.movimientoItem}>
      <View style={styles.movimientoHeader}>
        <Text style={styles.movimientoTipo}>
          {item.tipo === 'ingreso' ? '💰 INGRESO' : '💸 EGRESO'}
        </Text>
        <Text style={[
          styles.movimientoMonto,
          item.tipo === 'ingreso' ? styles.montoPositivo : styles.montoNegativo
        ]}>
          {item.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(item.monto)}
        </Text>
      </View>
      <Text style={styles.movimientoDescripcion}>{item.descripcion}</Text>
      <Text style={styles.movimientoFecha}>{formatDate(item.fecha)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando caja chica...</Text>
      </View>
    );
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
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Caja Chica</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewM')}>
              <Feather name="plus" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>

          {/* Saldo Total */}
          <View style={styles.saldoContainer}>
            <Text style={styles.saldoLabel}>Saldo Total</Text>
            <Text style={[
              styles.saldoAmount,
              saldoTotal >= 0 ? styles.saldoPositivo : styles.saldoNegativo
            ]}>
              {formatCurrency(saldoTotal)}
            </Text>
          </View>

          {/* Botones de Acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.ingresoButton]}
              onPress={() => navigation.navigate('NewM', { tipo: 'ingreso' })}
            >
              <Feather name="plus" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Ingreso</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.egresoButton]}
              onPress={() => navigation.navigate('NewM', { tipo: 'egreso' })}
            >
              <Feather name="minus" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Egreso</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Movimientos */}
          <View style={styles.movimientosContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Movimientos')}>
                <Text style={styles.verTodosText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {movimientos.length > 0 ? (
              <FlatList
                data={movimientos}
                renderItem={renderMovimiento}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Feather name="inbox" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No hay movimientos registrados</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => navigation.navigate('NewM')}
                >
                  <Text style={styles.addButtonText}>Agregar primer movimiento</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  saldoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saldoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  saldoAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  saldoPositivo: {
    color: '#28a745',
  },
  saldoNegativo: {
    color: '#dc3545',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  ingresoButton: {
    backgroundColor: '#28a745',
  },
  egresoButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  movimientosContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  verTodosText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  movimientoItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  movimientoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  movimientoTipo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  movimientoMonto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  montoPositivo: {
    color: '#28a745',
  },
  montoNegativo: {
    color: '#dc3545',
  },
  movimientoDescripcion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  movimientoFecha: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 15,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
