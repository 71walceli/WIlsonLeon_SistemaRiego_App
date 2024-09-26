import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUsarData] = useState(null);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    AsyncStorage.removeItem('@userData:key');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@userData:key');
        setUsarData(jsonValue ? JSON.parse(jsonValue) : {});
        setIsLoggedIn(!!jsonValue);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    loadData();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppStack onLogout={handleLogout} />
      ) : (
        <AuthStack onAuthSuccess={handleAuthSuccess} />
      )}
    </NavigationContainer>
  );
};

export default App;
