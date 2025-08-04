
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
    <Stack.Navigator initialRouteName="Inicio">
      <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
      <Stack.Screen name="Recuperar" component={Recuperar} options={{ headerShown: false }} />
      <Stack.Screen name="RegistrarGerente" component={RegistrarGerente} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainStack() {
  const { userRole } = useAuth();
  
  return (
    <Stack.Navigator initialRouteName="P1Admin">
      <Stack.Screen name="P1Admin" component={P1Admin} options={{ headerShown: false }} />
      <Stack.Screen name="Principal" component={Principal} options={{ headerShown: false }} />
      <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
      <Stack.Screen name="Equipo" component={Equipo} options={{ headerShown: false }} />
      <Stack.Screen name="Cajachica" component={Cajachica} options={{ headerShown: false }} />
      <Stack.Screen name="Movimientos" component={Movimientos} options={{ headerShown: false }} />
      <Stack.Screen name="NewM" component={NewM} options={{ headerShown: false }} />
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      
      {/* Pantalla solo para gerentes */}
      {userRole === 'gerente' && (
        <Stack.Screen name="Configuracion" component={Configuracion} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
        Cargando...
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
