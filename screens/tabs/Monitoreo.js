import React, { useState, useEffect, useRef }  from 'react';
import { Image, View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { globalStyles } from '../estilos/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MonitoreoScreen = ({ navigation }) => {
  const [params, setParams] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [hideListParams, setHideListParams] = useState(true);
  const [hideListNotifs, setHideListNotifs] = useState(true);
  const [btn_flotante, setbtn_flotante] = useState('Parametros');
  const [notificationCount, setNotificationCount] = useState('');
  
  // Función para cargar datos de parámetros
  const fetchParams = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaparametros`, {
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
      setParams(dates);
      //setHideListParams(true); // Mostrar la lista después de cargar los datos
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    }
  };

  // Función para cargar datos de notificaciones
  const fetchDataNoti = async (bandera) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaHistorialSensores`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha1: '',
          fecha2:  '',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const responseData = await response.json();
      const datos = responseData.message instanceof Array
        ? responseData.message.slice(0,20).sort((n1, n2) => n2.fecha > n1.fecha)
        : [];
      setNotifs(datos);
      setNotificationCount(datos.reduce((count, cur) => count+(cur.estado === "1"), 0))
      //setHideListNotifs(true)
    } catch (error) {
      console.error(error);
      // Manejo del error
    }
  };

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    fetchParams();
    fetchDataNoti(true);

    // Intervalo para actualizar la cantidad de notificaciones cada 5 segundos
    const intervalId = setInterval(fetchDataNoti, 10000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Función para manejar el toggle del botón flotante
  const toggleNotifsShow = () => {
    if (hideListParams) {
      setbtn_flotante('Cerrar parámetros');
    } else {
      setbtn_flotante('Mostrar Parámetros');
    }

    setHideListParams(!hideListParams);
  };

  const fetchActualizarNoti = async (id) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=ActualizarHistorialSensores`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id
          // Puedes agregar email y password si es necesario para la autenticación
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const responseData = await response.json();
      const dates = responseData.message;
      fetchDataNoti();
      setNotificationCount(c => c-1);
    } catch (error) {
      console.error('Error fetching data1:', error);
      // Manejo del error
    }
  };
  const toggleParamsSHow = () => {
    setHideListNotifs(!hideListNotifs);
    fetchDataNoti();
  };

  // Renderizar elemento de lista de parámetros
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.listItemmodal}>
      <Text style={styles.title}>{item.nombre_parametro}</Text>
      <Text style={styles.subtitle}>{item.descripcion}</Text>
      {item.valor_minimo !== null && item.valor_minimo!=='' && item.valor_minimo!=='0.00' ?<Text style={styles.subtitle}>{'Valor Mínimo:' +item.valor_minimo}</Text>:''}
      {item.valor_maximo !== null && item.valor_maximo!=='' && item.valor_maximo!=='0.00' ?<Text style={styles.subtitle}>{'Valor Máximo:' +item.valor_maximo}</Text>:''}
      {item.unidad_medida !== null && item.unidad_medida!=='' ?<Text style={styles.subtitle}>{'Unidad de Medida:' +item.unidad_medida}</Text>:''}
      {item.estado_parametro!== null && item.estado_parametro!== ''?<Text style={styles.subtitle}>{'Estados:'+ item.estado_parametro}</Text>:''}
      <Text style={[styles.subtitle, item.estado === '1' ? styles.activo : styles.inactivo]}>
        {item.estado === '1' ? 'Activo' : 'Inactivo'}
      </Text>
     
    </TouchableOpacity>
  );

  // Renderizar elemento de lista de notificaciones
  const renderItemNoti = ({ item }) => (
    <TouchableOpacity style={styles.listItemmodal} onPress={() => fetchActualizarNoti(item.id)}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.subtitle}>{item.descripcion}</Text>
      {item.estado === '1'?<Text style={styles.newLabel}>Nuevo</Text>:''}
      <Text style={styles.subtitle}>{item.fecha}</Text>
      {/* Agregar más detalles si es necesario */}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Contenido condicional basado en showList y showListNoti */}
      {hideListParams && hideListNotifs ? (
        <ScrollView contentContainerStyle={styles.container}>
          {/* Renderizar elementos de monitoreo */}
          <View style={styles.rowtitle}>
            <Text style={styles.titlerow}>Menú de Monitoreos</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.neomorphContainer}
              onPress={() => navigation.navigate('HumedadSueloScreen')}
            >
              <Text style={styles.title}>Humedad del suelo</Text>
              <Image source={require('../../assets/humedadsuelo.png')} style={globalStyles.logomoni} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.neomorphContainer}
              onPress={() => navigation.navigate('TemperaturaHumedadScreen')}
            >
              <Text style={styles.title}>Temperatura y humedad relativa</Text>
              <Image source={require('../../assets/termometromoderno.png')} style={globalStyles.logomoni} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.neomorphContainer}
              onPress={() => navigation.navigate('DeteccionLluviaScreen')}
            >
              <Text style={styles.title}>Detección de lluvia</Text>
              <Image source={require('../../assets/lluvia.png')} style={globalStyles.logomoni} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.neomorphContainer}
              onPress={() => navigation.navigate('NivelLiquidoScreen')}
            >
              <Text style={styles.title}>Nivel de agua del reservorio</Text>
              <Image source={require('../../assets/nivelliquido1.png')} style={globalStyles.logomoni} />
            </TouchableOpacity>
            
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.neomorphContainer}
              onPress={() => navigation.navigate('ControladorBombaScreen')}
            >
              <Text style={styles.title}>Controlador de bomba</Text>
              <Image source={require('../../assets/agua.png')} style={globalStyles.logomoni} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.neomorphContainer1}
            >
              <Image source={require('../../assets/regandoplantas.png')} style={globalStyles.logomoni2} />
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      ) : (
        <>
          {hideListParams && params?.length >= 1 && params instanceof Array
            ?(
              <View style={styles.container}>
                <Text style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>Parámetros del cacao</Text>
                <FlatList
                  data={params}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )
            :hideListParams && <Text>No hay parámetros</Text>
          }
          {hideListNotifs && notifs?.length >= 1 && notifs instanceof Array
            ?(
              <View style={styles.container}>
                <Text style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>Alertas del riego</Text>
                <FlatList
                  data={notifs}
                  renderItem={renderItemNoti}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )
            :hideListNotifs && <Text>No hay alertas</Text>
          }
        </>
      )}

      {/* Botón flotante */}
      <TouchableOpacity
        style={{...styles.floatingButton, display: hideListParams ? "flex" : "none" }}
        onPress={() => {
          toggleParamsSHow();
        }}
      >
        <View style={[styles.iconContainer && styles.iconContainerFocused]}>
        <Icon name="list" size={50} color="black" />
        </View>
      </TouchableOpacity>

      {/* Campana flotante (ícono) */}
      <TouchableOpacity 
        style={{ position: 'absolute', bottom: 90, right: 30, 
          display: hideListNotifs ? "flex" : "none" 
        }}
        onPress={() => {
          toggleNotifsShow();
        }}
      >
        <Text style={{ fontSize: 50 }}>🔔</Text>
        <View style={{
          width: 35,
          backgroundColor: 'red',
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 2,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute'
        }}>
          <Text style={{ color: 'white', fontSize: 16 }}>{
            notificationCount !== null && notificationCount !== '' 
              ? Number(notificationCount) > 9 ? "9+" : notificationCount
              : '0'
          }</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 15,
  },
  listItemmodal: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 0,
    marginTop:10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  rowtitle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titlerow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  neomorphContainer: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    elevation: 3,
  },
  neomorphContainer1: {
    width: '48%',
    backgroundColor: 'transparent',
    borderRadius: 0,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  floatingButton: {
    justifyContent: 'space-between',
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 20,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    width: '70%',
  },
  activo: {
    color: 'green',
  },
  inactivo: {
    color: 'red',
  },
  buttonControl: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  activobtn: {
    color: '#FFF',
  },
  inactivobtn: {
    color: '#FFF',
  },
  closeButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  gradientOverlay: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: -30,
    left: -10,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  newLabel: {
    backgroundColor: 'red',
    borderRadius: 10,
    color: 'white',
    fontWeight: 'bold', // Opcional, si deseas que el texto sea más destacado
    width: 58,
    padding: 6,
    position:'absolute',
    right:10,
    top:10
  },
});

export default MonitoreoScreen;
