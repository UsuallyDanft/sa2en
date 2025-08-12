
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import DrawerContent from '../components/DrawerContent';

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
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Inicio">
      <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
      <Stack.Screen name="Recuperar" component={Recuperar} options={{ headerShown: false }} />
      <Stack.Screen name="RegistrarGerente" component={RegistrarGerente} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Stack Navigator para pantallas que necesitan mantenerse en stack
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="P1Admin" component={P1Admin} options={{ headerShown: false }} />
      <Stack.Screen name="NewM" component={NewM} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Drawer Navigator principal
function MainDrawer() {
  const { userRole, logout } = useAuth();
  
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        drawerActiveTintColor: '#4CAF50',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen 
        name="Inicio" 
        component={MainStack}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Principal" 
        component={Principal}
        options={{
          title: 'Menú Principal',
          drawerIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Cajachica" 
        component={Cajachica}
        options={{
          title: 'Caja Chica',
          drawerIcon: ({ color, size }) => (
            <Feather name="dollar-sign" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Movimientos" 
        component={Movimientos}
        options={{
          title: 'Movimientos',
          drawerIcon: ({ color, size }) => (
            <Feather name="activity" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Registro" 
        component={Registro}
        options={{
          title: 'Registros',
          drawerIcon: ({ color, size }) => (
            <Feather name="file-plus" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Equipo" 
        component={Equipo}
        options={{
          title: 'Equipo',
          drawerIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Menu" 
        component={Menu}
        options={{
          title: 'Menú',
          drawerIcon: ({ color, size }) => (
            <Feather name="menu" size={size} color={color} />
          ),
        }}
      />
      
      {/* Pantalla solo para gerentes */}
      {userRole === 'gerente' && (
        <Drawer.Screen 
          name="Configuracion" 
          component={Configuracion}
          options={{
            title: 'Configuración',
            drawerIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
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
  
  return isAuthenticated ? <MainDrawer /> : <AuthStack />;
}

export default MainNavigator;
