
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

// Importación de las pantallas
import Principal from '../pantallas/Principal';
import Inicio from '../pantallas/Inicio';
import Recuperar from '../pantallas/Recuperar';
import RegistrarGerente from '../pantallas/RegistrarGerente';
import P1Admin from '../pantallas/P1Admin';
import Registro from '../pantallas/Registro';
import Equipo from '../pantallas/Equipo';
import Cajachica from '../pantallas/Cajachica';
import Movimientos from '../pantallas/Movimientos';
import NewM from '../pantallas/NewM';
import Menu from '../pantallas/Menu';
import Configuracion from '../pantallas/Configuracion';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Inicio"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Inicio" component={Inicio} />
      <Stack.Screen name="Recuperar" component={Recuperar} />
      <Stack.Screen name="RegistrarGerente" component={RegistrarGerente} />
    </Stack.Navigator>
  );
}

function MainStack() {
  const { userRole } = useAuth();
  
  return (
    <Stack.Navigator 
      initialRouteName="Principal"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Principal" component={Principal} />
      <Stack.Screen name="P1Admin" component={P1Admin} />
      <Stack.Screen name="Registro" component={Registro} />
      <Stack.Screen name="Equipo" component={Equipo} />
      <Stack.Screen name="Cajachica" component={Cajachica} />
      <Stack.Screen name="Movimientos" component={Movimientos} />
      <Stack.Screen name="NewM" component={NewM} />
      <Stack.Screen name="Menu" component={Menu} />
      
      {/* Pantalla solo para gerentes */}
      {userRole === 'gerente' && (
        <Stack.Screen name="Configuracion" component={Configuracion} />
      )}
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
        Cargando aplicación...
      </Text>
    </View>
  );
}

function MainNavigator() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? <MainStack /> : <AuthStack />;
}

export default MainNavigator;
