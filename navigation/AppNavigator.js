import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import P1Admin from '../pantallas/P1Admin';
import Registro from '../pantallas/Registro';
import Equipo from '../pantallas/Equipo';
import Cajachica from '../pantallas/Cajachica';
import Movimientos from '../pantallas/Movimientos';
import NewM from '../pantallas/NewM';
import Menu from '../pantallas/Menu';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="P1Admin"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="P1Admin" component={P1Admin} />
      <Stack.Screen name="Registro" component={Registro} />
      <Stack.Screen name="Equipo" component={Equipo} />
      <Stack.Screen name="Cajachica" component={Cajachica} />
      <Stack.Screen name="Movimientos" component={Movimientos} />
      <Stack.Screen name="NewM" component={NewM} />
      <Stack.Screen name="Menu" component={Menu} />
    </Stack.Navigator>
  );
}