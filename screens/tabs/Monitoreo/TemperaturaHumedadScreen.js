import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable,SafeAreaView } from 'react-native';
import { globalStyles } from '../../estilos/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EChartsComponent from './EChartstemperatura'; // Asegúrate de tener la ruta correcta


const TemperaturaHumedadScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.rowtitle}>
        <Text style={styles.titlerow}>Monitoreo de Temperatura y Humedad Relativa  <Image source={require('../../../assets/termometromoderno.png')} style={globalStyles.logomoniinter} /></Text>
       
      </View>
      <View style={styles.row}>
        <View style={styles.neomorphContainer}>
          <Text style={styles.title}>Temperatura y Humedad Relativa</Text>
         
          <Text style={styles.title}>Datos Actuales</Text>
          <SafeAreaView style={{ flex: 1 }}>
            <EChartsComponent />
          </SafeAreaView>
        </View>
      </View>
      <Pressable style={globalStyles.backButton1} onPress={handleBack}>
        <Icon name="arrow-back" size={24} color="black" />
      </Pressable>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E5EC',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height:'80%',
    marginVertical: 10,
  },
  rowtitle: {
    width: '100%',
    marginVertical: 10,
    marginLeft: 50,
    marginTop:50,
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
    margin: 10,
    textAlign: 'center',
    minWidth: '50%',
    maxWidth: '90%',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 5,
    color: 'black',
  },
  containermedidor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%',
    height: 400,
  },
  chart: {
    height: 400,
    width: '100%',
  },
});

export default TemperaturaHumedadScreen;
