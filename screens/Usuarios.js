import React, { useState, useEffect } from 'react';
import { Button,View, FlatList, StyleSheet, Text, TouchableOpacity,Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from './estilos/estilologin.js'; 

const UsuariosScreen = () => {
  const [userData, setUserData] = useState({});

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultausuario`, {
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
      let dates=responseData.message;
      setUserData(dates);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    // Función para volver a cargar los datos
    fetchData();
  };

  const handleEstado = async (id, estado) => {
    try {
      let estadoreal=(estado=='1')?'6':'1';
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=EstadoUsuario`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          estadoreal
        }),
      });
      const responseData = await response.json();
      let dates=responseData.message;
      console.log(dates);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      handleRefresh();
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem} onPress={() => handleItemPress(item)}>
      <Text style={styles.title}>{item.nombre ? item.nombre : 'Nombre no disponible'}</Text>
      <Text style={styles.subtitle}>{item.apellido ? item.apellido : 'Apellido no disponible'}</Text>
      <Text style={styles.subtitle}>{item.rol ? item.rol : 'Rol no disponible'}</Text>
      <Text style={[styles.subtitle, item.estado === '1' ? styles.activo : styles.inactivo]}>
        {item.estado === '1' ? 'Activo' : 'Inactivo'}
      </Text>
      <Pressable style={styles.buttonControl} onPress={() =>handleEstado(item.id,item.estado)}>
        <Text style={[styles.subtitle, item.estado === '1' ? styles.activobtn : styles.inactivobtn]}> {item.estado === '1' ? 'Desactivar' : 'Activar'}
        </Text>
      </Pressable>
      {/* Agrega más campos según tus necesidades */}
    </View>
  );

  const handleItemPress = (item) => {
    // Aquí podrías navegar a una pantalla de detalle o editar según el ítem seleccionado
    console.log('Item seleccionado:', item);
  };

  return (
    <View style={styles.container}>
       
      <FlatList
        data={userData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Pressable style={styles.button} onPress={handleRefresh}>
        {loading 
          ?<ActivityIndicator color="#fff" />
          :<Text style={globalStyles.text}><Icon name="sync-alt" size={20} color="#FFFF" /> Actualizar</Text>
        }
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop:20
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  activo: {
    color: 'green', // Color verde para estado activo
    fontWeight: 'bold', // Puedes agregar estilos adicionales según necesites
  },
  inactivo: {
    color: 'red', // Color rojo para estado inactivo
    fontWeight: 'bold', // Puedes agregar estilos adicionales según necesites
  },
  activobtn: {
    color: '#EAF10B', // Color verde para estado activo
    fontWeight: 'bold', // Puedes agregar estilos adicionales según necesites
  },
  inactivobtn: {
    color: 'white', // Color rojo para estado inactivo
    fontWeight: 'bold', // Puedes agregar estilos adicionales según necesites
  },
  buttonControl: {
    width: '25%',
    height: 40,
    left:240,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default UsuariosScreen;
