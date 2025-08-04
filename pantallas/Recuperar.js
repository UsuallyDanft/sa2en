import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Recuperar() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Recuperar Contraseña</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
