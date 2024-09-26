import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from '../screens/MenuScreen'; // Importa el Tabs que contiene la navegación por pestañas

const Stack = createStackNavigator();

const AppStack = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs">
        {props => <Tabs {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppStack;

