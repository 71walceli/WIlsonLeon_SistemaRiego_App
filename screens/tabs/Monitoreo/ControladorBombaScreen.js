import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable,TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { globalStyles } from '../../estilos/styles';
import AguaCargaWebView from './AguaCargaWebView';


const ControladorBombaScreen = ({ navigation }) => {
  const [loadingText, setLoadingText] = useState('Cargando');
  const [loadingText1, setLoadingText1] = useState('Bomba');
  const words = ['Desactivada','Activada'];
  const [btn_flotante, setbtn_flotante] = useState('Activar Bomba');
  const [btn_flotante1, setbtn_flotante1] = useState('Desactivar Bomba');
  const [btn_flotante2, setbtn_flotante2] = useState('Bomba Automática');
  const [userData, setUserData] = useState({}); 
  
  const [estadoBomba, setEstadoBomba] = useState({}); 

  const [loading, setLoading] = useState(false);

  const handleEditado = async (estado,usuario,servicio) => {
    if (loading) 
        return;

    if (estadoBomba?.servicio === "MANUAL" && estadoBomba?.estado === "1" 
        && userData.id !== estadoBomba?.usuario.id
    ) {
      Alert.alert("Bomba activada", `No es posible desactivar la bomba ya que  ${
        estadoBomba.usuario.nombre} ${estadoBomba.usuario.apellido} la activó de modo manual`
      )
      return
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=EditarBomba`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: estado || '',
          servicio: servicio,
          usuario: usuario.nombre+' '+usuario.apellido,
          rol: usuario.rol,
          id_usuario: usuario.id,
        }),
      });

      if (!response.ok) {
        let responseData = {};
        responseData = await response.json();  
        console.log(responseData.message); 
        throw new Error(`HTTP error ${response.status}`); 
      }

      fetchData(); // Actualizar la lista después de editar el parámetro
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaBomba`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Puedes agregar email y password si es necesario para la autenticación
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const responseData = await response.json();
      const dates = responseData.message;
      setLoadingText1('Bomba');
      setLoadingText(words[dates.estado]);
      setEstadoBomba(dates)
      console.log('Datos obtenidos:', dates); // Mostramos los datos obtenidos por consola
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    }
  };
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
    fetchData()
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={globalStyles.backButton1} onPress={handleBack}>
        <Icon name="arrow-back" size={24} color="black" />
      </Pressable>
      <View style={styles.rowtitle}>
        <Text style={styles.titlerow}>Monitoreo de Controlador de Bomba 
          <Image soure={require('../../../assets/agua.png')} style={globalStyles.logomoniinter} />
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.neomorphContainer}>
          <Text style={styles.title}>
              Controlador de Bomba
              {loading && <ActivityIndicator color="white" />}
          </Text>
          <Text style={styles.title}>
              Modo: {estadoBomba?.servicio}
              {loading && <ActivityIndicator color="white" />}
          </Text>
          <SafeAreaView style={{ flex: 1 }}>
            <AguaCargaWebView loadingText={loadingText} loadingText1={loadingText1}/>
          </SafeAreaView>

        </View>
      </View>
      {/* Botón de retroceso */}
      <TouchableOpacity
        style={styles.floatingButton2}
        onPress={() => {
          handleEditado('1',userData,'AUTOMATICO');
        }}
      >
        <View style={[styles.iconContainer && styles.iconContainerFocused]}>
          <Icon name="motion-photos-auto" size={60} color="blue" />
        </View>
      </TouchableOpacity>
      <Text style={styles.floatingButtonText}>{btn_flotante2}</Text>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          handleEditado('1',userData,'MANUAL');
        }}
      >
        <View style={[styles.iconContainer && styles.iconContainerFocused]}>
        <Icon name="power-settings-new" size={60} color="green" />
        </View>
      </TouchableOpacity>
      <Text style={styles.floatingButtonText2}>{btn_flotante}</Text>
      <TouchableOpacity
        style={styles.floatingButton1}
        onPress={() => {
          handleEditado('0',userData,'MANUAL');
        }}
      >
        <View style={[styles.iconContainer1 && styles.iconContainerFocused1]}>
        <Icon name="power-settings-new" size={60} color="red" />
          
        </View>
      </TouchableOpacity>
      <Text style={styles.floatingButtonText1}>{btn_flotante1}</Text>
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
    backgroundColor: '#000000',
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
    minWidth: '70%',
    maxWidth: '100%',
  },
  title: {
    fontSize: 18,
    color: 'white',
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
  floatingButton: {
    justifyContent: 'space-between',
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 50,
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 80,
    elevation: 5, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
    left:20,
    bottom: -40,
  },
  floatingButtonText2: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -40,
  },
  gradientOverlay: {
    position: 'absolute',
    textAlign:'center',
    width: 100,
    height: 100,
    top: -30,
    left: -22,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  floatingButton1: {
    justifyContent: 'space-between',
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 50,
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
    right:30,
    bottom: 80,
    elevation: 5, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  floatingButtonText1: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
    right:20,
    bottom: -40,
  },
  floatingButton2: {
    justifyContent: 'space-between',
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 50,
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center',
    left:35,
    bottom: 80,
    elevation: 5, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  gradientOverlay1: {
    position: 'absolute',
    textAlign:'center',
    width: 100,
    height: 100,
    top: -30,
    left: -10,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  gradientOverlay2: {
    position: 'absolute',
    textAlign:'center',
    width: 100,
    height: 100,
    top: -30,
    left: -8,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
});

export default ControladorBombaScreen;
