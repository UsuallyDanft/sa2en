
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../FirebaseConf';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Feather from '@expo/vector-icons/Feather';

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'movimientos'),
      orderBy('fecha', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const movimientosData = [];
      querySnapshot.forEach((doc) => {
        movimientosData.push({
          id: doc.id,
          ...doc.data(),
          fecha: doc.data().fecha?.toDate() || new Date()
        });
      });
      setMovimientos(movimientosData);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('Error fetching movimientos:', error);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id, descripcion) => {
    Alert.alert(
      'Eliminar Movimiento',
      `¿Estás seguro de eliminar "${descripcion}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'movimientos', id));
              Alert.alert('Éxito', 'Movimiento eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el movimiento');
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  const renderMovimiento = ({ item }) => (
    <View style={styles.movimientoCard}>
      <View style={styles.movimientoHeader}>
        <View style={[styles.tipoIndicator, { 
          backgroundColor: item.tipo === 'ingreso' ? '#4CAF50' : '#f44336' 
        }]} />
        <View style={styles.movimientoInfo}>
          <Text style={styles.descripcion}>{item.descripcion}</Text>
          <Text style={styles.fecha}>
            {item.fecha.toLocaleDateString()} - {item.fecha.toLocaleTimeString()}
          </Text>
          <Text style={styles.categoria}>{item.categoria}</Text>
        </View>
        <View style={styles.montoContainer}>
          <Text style={[styles.monto, { 
            color: item.tipo === 'ingreso' ? '#4CAF50' : '#f44336' 
          }]}>
            {item.tipo === 'ingreso' ? '+' : '-'}S/ {item.monto}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.descripcion)}
        >
          <Feather name="trash-2" size={16} color="#fff" />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const calculateTotal = () => {
    return movimientos.reduce((total, mov) => {
      return mov.tipo === 'ingreso' ? total + mov.monto : total - mov.monto;
    }, 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando movimientos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Movimientos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewM')}>
          <Feather name="plus" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance Total</Text>
        <Text style={[styles.balanceAmount, {
          color: calculateTotal() >= 0 ? '#4CAF50' : '#f44336'
        }]}>
          S/ {calculateTotal().toFixed(2)}
        </Text>
      </View>

      {/* Lista de movimientos */}
      <FlatList
        data={movimientos}
        renderItem={renderMovimiento}
        keyExtractor={item => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No hay movimientos registrados</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('NewM')}
            >
              <Text style={styles.addButtonText}>Agregar Movimiento</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  balanceCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  movimientoCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    elevation: 2,
  },
  movimientoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 15,
  },
  movimientoInfo: {
    flex: 1,
  },
  descripcion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  categoria: {
    fontSize: 14,
    color: '#888',
  },
  montoContainer: {
    alignItems: 'flex-end',
  },
  monto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
