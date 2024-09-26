import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { globalStyles } from './estilos/styles';


const PerfilScreen = () => {
  const [userData, setUserData] = useState({}); 
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@userData:key');
        let datos = jsonValue != null ? JSON.parse(jsonValue) : {};
        console.log(datos);
        setUserData(datos);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    loadData();
  }, []); // El arreglo de dependencias vacío asegura que useEffect se ejecute solo una vez al montar el componente

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <Text style={styles.titlerow}>Perfil</Text>
      </View>
      <View style={styles.row}>
        <View
          style={styles.neomorphContainer}
        >
          
          <Image source={require('../assets/perfil.png')} style={globalStyles.logomoniperfil} />
          <Text style={styles.title}>{userData.rol}</Text>
          <Text style={styles.title}>{userData.nombre}</Text>
          <Text style={styles.title}>{userData.apellido}</Text>
          <Text style={styles.title}>{userData.cedula}</Text>
          <Text style={styles.title}>{userData.correo}</Text>
          <Text style={styles.title}>{userData.direccion}</Text>
        </View>
      </View>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E5EC',
    //paddingVertical: 120,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  rowtitle: {
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'left',
    width: '100%',
    marginVertical: 10,
    marginLeft: 50,
  },
  neomorphContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 15,
    margin: 0,
    textAlign: 'center',
    minWidth: '50%',
    maxWidth: '80%',
  },
  title: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  titlerow: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default PerfilScreen;
