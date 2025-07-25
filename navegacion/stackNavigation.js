import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importación de las pantallas
import Principal from '../pantallas/Principal';
import Inicio from '../pantallas/Inicio';
import Recuperar from '../pantallas/Recuperar';
import Registrar from '../pantallas/Registrar';
import P1Admin from '../pantallas/P1Admin';
import Registro from '../pantallas/Registro';
import Equipo from '../pantallas/Equipo';
import Cajachica from '../pantallas/Cajachica';
import Movimientos from '../pantallas/Movimientos';
import NewM from '../pantallas/NewM';
import Menu from '../pantallas/Menu';

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="P1Admin">
      <Stack.Screen name="Principal" component={Principal} options={{ headerShown: false }} />
      <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
      <Stack.Screen name="Recuperar" component={Recuperar} options={{ headerShown: false }} />
      <Stack.Screen name="Registrar" component={Registrar} options={{ headerShown: false }} />
      <Stack.Screen name="P1Admin" component={P1Admin} options={{ headerShown: false }} />
      <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
      <Stack.Screen name="Equipo" component={Equipo} options={{ headerShown: false }} />
      <Stack.Screen name="Cajachica" component={Cajachica} options={{ headerShown: false }} />
      <Stack.Screen name="Movimientos" component={Movimientos} options={{ headerShown: false }} />
      <Stack.Screen name="NewM" component={NewM} options={{ headerShown: false }} />
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Exportamos el componente del navegador
export default MainNavigator;