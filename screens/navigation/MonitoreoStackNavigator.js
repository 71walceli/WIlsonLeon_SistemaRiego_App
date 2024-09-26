import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MonitoreoScreen from '../tabs/Monitoreo';
import HumedadSueloScreen from '../tabs/Monitoreo/HumedadSueloScreen';
import TemperaturaHumedadScreen from '../tabs/Monitoreo/TemperaturaHumedadScreen';
import DeteccionLluviaScreen from '../tabs/Monitoreo/DeteccionLluviaScreen';
import NivelLiquidoScreen from '../tabs/Monitoreo/NivelLiquidoScreen';
import ControladorBombaScreen from '../tabs/Monitoreo/ControladorBombaScreen';

const Stack = createStackNavigator();

const MonitoreoStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MonitoreoMenu" component={MonitoreoScreen} />
      <Stack.Screen name="HumedadSueloScreen" component={HumedadSueloScreen} />
      <Stack.Screen name="TemperaturaHumedadScreen" component={TemperaturaHumedadScreen} />
      <Stack.Screen name="DeteccionLluviaScreen" component={DeteccionLluviaScreen} />
      <Stack.Screen name="NivelLiquidoScreen" component={NivelLiquidoScreen} />
      <Stack.Screen name="ControladorBombaScreen" component={ControladorBombaScreen} />
    </Stack.Navigator>
  );
};

export default MonitoreoStackNavigator;
