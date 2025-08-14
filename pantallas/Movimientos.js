import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Picker, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { db, auth } from '../FirebaseConf';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function Movimientos() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para los filtros
  const [tipoRegistro, setTipoRegistro] = useState('Obra');
  const [nombreServicio, setNombreServicio] = useState('');
  const [nombreCaja, setNombreCaja] = useState('');
  
  // Estados para los datos
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [cajasDisponibles, setCajasDisponibles] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  
  // Estados para los saldos
  const [saldoActual, setSaldoActual] = useState(0);
  const [montoCaja, setMontoCaja] = useState(0);

  // Mapeo de tipos de registro a subcolecciones
  const getSubcoleccion = (tipo) => {
    const map = {
      'Obra': 'Robra',
      'Servicios': 'Rservicios',
      'Bienes': 'Rbienes'
    };
    return map[tipo] || 'Robra';
  };

  // Cargar servicios disponibles según tipo de registro
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const subcoleccion = getSubcoleccion(tipoRegistro);
    const serviciosRef = collection(db, 'gerentes', user.uid, subcoleccion);
    
    const unsubscribe = onSnapshot(serviciosRef, (snapshot) => {
      const servicios = snapshot.docs.map(doc => doc.id);
      setServiciosDisponibles(servicios);
      setNombreServicio('');
      setNombreCaja('');
    });

    return unsubscribe;
  }, [tipoRegistro]);

  // Cargar cajas disponibles cuando se selecciona un servicio
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !nombreServicio) return;

    const subcoleccion = getSubcoleccion(tipoRegistro);
    const cajasRef = collection(db, 'gerentes', user.uid, subcoleccion, nombreServicio, 'cajas_chicas');
    
    const unsubscribe = onSnapshot(cajasRef, (snapshot) => {
      const cajas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        nombre: doc.data().nombreCaja,
        monto: doc.data().monto
      }));
      
      setCajasDisponibles(cajas);
      setNombreCaja('');
    });

    return unsubscribe;
  }, [tipoRegistro, nombreServicio]);

  // Cargar movimientos cuando se selecciona una caja
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !nombreServicio || !nombreCaja) return;

    const subcoleccion = getSubcoleccion(tipoRegistro);
    const movimientosRef = collection(
      db, 
      'gerentes', 
      user.uid, 
      subcoleccion, 
      nombreServicio, 
      'cajas_chicas', 
      nombreCaja, 
      'movimientos'
    );

    const q = query(movimientosRef, orderBy('creadoEn', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const movs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().creadoEn?.toDate()
      }));
      
      setMovimientos(movs);
      
      // Calcular saldo actual
      const cajaSeleccionada = cajasDisponibles.find(c => c.nombre === nombreCaja);
      if (cajaSeleccionada) {
        const saldoInicial = parseFloat(cajaSeleccionada.monto) || 0;
        const totalEgresos = movs.reduce((sum, mov) => sum + (mov.tipo === 'egreso' ? parseFloat(mov.monto) : 0), 0);
        setSaldoActual(saldoInicial - totalEgresos);
        setMontoCaja(saldoInicial);
      }
      
      setLoading(false);
      setRefreshing(false);
    });

    return unsubscribe;
  }, [tipoRegistro, nombreServicio, nombreCaja, cajasDisponibles]);

  const onRefresh = () => {
    setRefreshing(true);
    // La recarga se maneja automáticamente por los listeners de Firestore
  };

  const handleAddMovimiento = (tipo) => {
    const user = auth.currentUser;
    if (!user || !nombreServicio || !nombreCaja) return;

    navigation.navigate('NewM', {
      tipo,
      tipoRegistro,
      nombreServicio,
      nombreCaja,
      montoCaja,
      subcoleccion: getSubcoleccion(tipoRegistro)
    });
  };

if (loading && !nombreCaja && serviciosDisponibles.length > 0 && cajasDisponibles.length > 0) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0B1B4D" />
      <Text>Cargando datos iniciales...</Text>
    </View>
  );
}

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Tipo:</Text>
          <Picker
            selectedValue={tipoRegistro}
            style={styles.picker}
            onValueChange={setTipoRegistro}>
            <Picker.Item label="Obra" value="Obra" />
            <Picker.Item label="Servicios" value="Servicios" />
            <Picker.Item label="Bienes" value="Bienes" />
          </Picker>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Servicio:</Text>
          <Picker
            selectedValue={nombreServicio}
            style={styles.picker}
            onValueChange={setNombreServicio}>
            <Picker.Item label="Seleccione servicio" value="" />
            {serviciosDisponibles.map((servicio, i) => (
              <Picker.Item key={i} label={servicio} value={servicio} />
            ))}
          </Picker>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Caja:</Text>
          <Picker
            selectedValue={nombreCaja}
            style={styles.picker}
            onValueChange={setNombreCaja}>
            <Picker.Item label="Seleccione caja" value="" />
            {cajasDisponibles.map((caja, i) => (
              <Picker.Item key={i} label={caja.nombre} value={caja.nombre} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Mostrar datos solo si hay una caja seleccionada */}
      {nombreCaja ? (
        <>
          {/* Información de la caja */}
          <View style={styles.headerBox}>
            <Text style={styles.cajaTitle}>{nombreCaja}</Text>
            <View style={styles.saldoContainer}>
              <Text style={styles.saldoLabel}>Saldo disponible:</Text>
              <Text style={styles.saldoTotal}>S/ {saldoActual.toFixed(2)}</Text>
            </View>
            <Text style={styles.montoInicial}>Monto inicial: S/ {montoCaja.toFixed(2)}</Text>
          </View>

          {/* Lista de movimientos */}
          <FlatList
            data={movimientos}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.movimientoCard,
                  item.tipo === 'egreso' ? styles.egresoCard : styles.ingresoCard
                ]}
                onPress={() => navigation.navigate('NewM', { 
                  ...item,
                  editar: true,
                  tipoRegistro,
                  nombreServicio,
                  nombreCaja,
                  subcoleccion: getSubcoleccion(tipoRegistro)
                })}>
                <View style={styles.movimientoInfo}>
                  <Text style={styles.movimientoDescripcion}>{item.descripcion || 'Sin descripción'}</Text>
                  <Text style={styles.movimientoFecha}>
                    {item.fecha?.toLocaleDateString('es-PE', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                <Text style={styles.movimientoMonto}>
                  {item.tipo === 'egreso' ? '-' : '+'} S/ {parseFloat(item.monto).toFixed(2)}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="inbox" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No hay movimientos registrados</Text>
              </View>
            }
          />

          {/* Botones flotantes */}
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={styles.bottomButton}
              onPress={() => handleAddMovimiento('egreso')}>
              <Feather name="minus-circle" size={20} color="#fff" />
              <Text style={styles.bottomButtonText}>Egreso</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.bottomButton}
              onPress={() => handleAddMovimiento('ingreso')}>
              <Feather name="plus-circle" size={20} color="#fff" />
              <Text style={styles.bottomButtonText}>Ingreso</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.selectContainer}>
          <Feather name="database" size={50} color="#0B1B4D" />
          <Text style={styles.selectText}>Seleccione un servicio y una caja</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  filterLabel: {
    width: 80,
    fontWeight: 'bold',
    color: '#0B1B4D'
  },
  picker: {
    flex: 1,
    height: 40
  },
  headerBox: {
    backgroundColor: '#0B1B4D',
    padding: 20,
    alignItems: 'center'
  },
  cajaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  saldoContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    marginVertical: 10
  },
  saldoLabel: {
    fontSize: 16,
    color: '#0B1B4D',
    marginBottom: 5
  },
  saldoTotal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B1B4D'
  },
  montoInicial: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8
  },
  movimientoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 1
  },
  egresoCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#ff5252'
  },
  ingresoCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50'
  },
  movimientoInfo: {
    flex: 1
  },
  movimientoDescripcion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  movimientoFecha: {
    fontSize: 12,
    color: '#666'
  },
  movimientoMonto: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 15
  },
  selectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectText: {
    fontSize: 18,
    color: '#0B1B4D',
    marginTop: 15,
    textAlign: 'center'
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0B1B4D',
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  bottomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5
  }
});