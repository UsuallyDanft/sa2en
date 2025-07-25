import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Importa tu nuevo componente de navegación
import MainNavigator from './navegacion/stackNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}