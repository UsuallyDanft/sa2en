import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Principal from '../pantallas/Principal';
import Inicio from '../pantallas/Inicio';
import Recuperar from '../pantallas/Recuperar';
import Registrar from '../pantallas/Registrar';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Principal"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Principal" component={Principal} />
      <Stack.Screen name="Inicio" component={Inicio} />
      <Stack.Screen name="Recuperar" component={Recuperar} />
      <Stack.Screen name="Registrar" component={Registrar} />
    </Stack.Navigator>
  );
}