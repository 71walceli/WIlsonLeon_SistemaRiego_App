import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PerfilScreen from './Perfil';
import MonitoreoStackNavigator from './navigation/MonitoreoStackNavigator';
import ParametrosScreen from './Parametros';
import UsuariosScreen from './Usuarios';
import ReporteScreen from './Reporte';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native'; // Importar ActivityIndicator
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const Tabs = ({ onLogout }) => {
  
  const handleLogout = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas salir del sistema?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salir',
          onPress: () => {
            onLogout();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const [userData, setUsarData] = useState(null); // Inicialmente null para indicar que no se ha cargado

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@userData:key');
        setUsarData(jsonValue ? JSON.parse(jsonValue) : {});
        console.log({ jsonValue });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    loadData();
  }, []);

  const renderTabBarIcon = (iconName, focused, color, size) => {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
        {focused && (
          <LinearGradient 
            colors={['#EDEEEC', '#EDEEEC', '#D7DDE8']}
            style={styles.gradientOverlay}
          />
        )}
        <Icon name={iconName} color={focused ? '#5CB85C' : color} size={focused ? size + 24 : size + 4} />
      </View>
    );
  };

  return <>{userData?.rol
    ?<Tab.Navigator
      initialRouteName="Monitoreo"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Aquí se evalúa el rol para mostrar las pestañas correspondientes
          if (userData.rol === 'Administrador') {
            if (route.name === 'Parametros') {
              iconName = focused ? 'settings' : 'settings';
            } else if (route.name === 'Usuarios') {
              iconName = focused ? 'people' : 'people';
            } else if (route.name === 'Monitoreo') {
              iconName = focused ? 'assessment' : 'assessment';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            }else if (route.name === 'Reporte') {
              iconName = focused ? 'insert-drive-file' : 'insert-drive-file';
            } else if (route.name === 'Salir') {
              iconName = focused ? 'exit-to-app' : 'exit-to-app';
            }
          } else if (userData.rol === 'Jornalero') {
            if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Monitoreo') {
              iconName = focused ? 'assessment' : 'assessment';
            }else if (route.name === 'Salir') {
              iconName = focused ? 'exit-to-app' : 'exit-to-app';
            }
          }

          return renderTabBarIcon(iconName, focused, color, size);
        },
      })}
    >
      {userData.rol === 'Administrador' && (
        <>
          <Tab.Screen name='Parametros' component={ParametrosScreen} options={{ 
            headerShown: true,
            title: "Parametrización ",
          }} />
          <Tab.Screen name='Usuarios' component={UsuariosScreen} options={{ 
            headerShown: true,
            title: "Habilitación de usuarios",
          }} />
          <Tab.Screen name='Monitoreo' component={MonitoreoStackNavigator} options={{ 
            headerShown: true,
            title: "Menú de monitoreo",
          }} />
          <Tab.Screen name='Perfil' component={PerfilScreen} options={{ 
            headerShown: true,
            title: "Perfil del usuario",
          }}/>
          <Tab.Screen name='Reporte' component={ReporteScreen} options={{ 
            headerShown: true,
            title: "Informe",
          }}/>
          <Tab.Screen
            name="Salir"
            component={LogoutButton}
            listeners={{
              tabPress: (e) => {
                e.preventDefault(); // Evitar la navegación predeterminada
                handleLogout();
              },
            }}
          />
        </>
      )}
      {userData.rol === 'Jornalero' && (
        <>
          <Tab.Screen name='Monitoreo' component={MonitoreoStackNavigator} options={{ 
            headerShown: true,
            title: "Menú de monitoreo",
          }} />
          <Tab.Screen name='Perfil' component={PerfilScreen} options={{ 
            headerShown: true,
            title: "Perfile del usuario",
          }}/>
          <Tab.Screen
            name="Salir"
            component={LogoutButton}
            listeners={{
              tabPress: (e) => {
                e.preventDefault(); // Evitar la navegación predeterminada
                handleLogout();
              },
            }}
          />
        </>
      )}
    </Tab.Navigator>
    :<ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
  }</>
};

const LogoutButton = () => null; // Un componente vacío para la pestaña de salida

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 0,
    height: 70,
    marginHorizontal: 0,
    marginBottom: 0,
    paddingVertical: 0,
  },
  iconContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    padding: 13,
    marginBottom: 2,
    borderRadius: 100,
  },
  iconContainerFocused: {
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 4,
    height: 75,
    width: 75,
    top: -10,
    borderWidth: 0.2, // Ajusta el grosor del borde según lo necesites
    borderColor: '#6c6c6c', // Gris medio oscuro
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Tabs;
