import React, { useState, useEffect } from 'react';
import { 
  View, FlatList, StyleSheet, Text, TouchableOpacity,Pressable, ActivityIndicator, ScrollView,
  TextInput, Modal, Alert, RefreshControl, TouchableWithoutFeedback, Keyboard, Image, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { globalStyles } from './estilos/estilologin.js'; 
import { styles } from '../styles/forms.js';


const UsuariosScreen = () => {
  const [userData, setUserData] = useState({});
  const [formState, setFormState] = useState({}); // Estado para almacenar el estado del formulario
  const [formMode, setFormMode] = useState('edit'); // Estado para controlar el modo del formulario (edit o add)
  const [showForm, setShowForm] = useState(false)

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => () => console.log("rerender screen"))

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

  // Función para manejar el cambio en los campos del formulario
  const handleInputChange = (fieldName, value) => {
    setFormState({ ...formState, [fieldName]: value });
  };

  const handleSubmit = () => {
    const numberRegex = /^[0-9]+(\.[0-9]*)?$/;
    
    if (formMode === 'edit') {
       // Validación de valor_maximo
     if (formMode.valor_maximo === null && formMode.valor_maximo === undefined &&
      formMode.valor_maximo === '' && !numberRegex.test(formMode.valor_maximo)) {
        Alert.alert('No puede ingresar letras o símbolos, solo se acepta el punto y números');
        return;
      }
      // Validación de valor_minimo
      if (formMode.valor_minimo === null && formMode.valor_minimo === undefined &&
          formMode.valor_minimo === '' && !numberRegex.test(formMode.valor_minimo)) {
        Alert.alert('No puede ingresar letras o símbolos, solo se acepta el punto y números');
        return;
      }
      handleEditado(
        formState.nombre_parametro,
        formState.descripcion,
        formState.valor_minimo,
        formState.valor_maximo,
        formState.unidad_medida,
        formState.estado_parametro,
        formState.id, // Envía el id del parámetro al backend
      );
    } else if (formMode === 'add') {
       // Validación de valor_maximo
      if (formMode.valor_maximo === null && formMode.valor_maximo === undefined &&
        formMode.valor_maximo === '' && !numberRegex.test(formMode.valor_maximo)) {
          Alert.alert('No puede ingresar letras o símbolos, solo se acepta el punto y números');
          return;
        }
        console.log(formMode.valor_minimo);
        // Validación de valor_minimo
        if (formMode.valor_minimo === null && formMode.valor_minimo === undefined &&
            formMode.valor_minimo === '' && !numberRegex.test(formMode.valor_minimo)) {
          Alert.alert('No puede ingresar letras o símbolos, solo se acepta el punto y números');
          return;
        }

      if(formMode.valor_maximo ==='0.00' && formMode.valor_minimo ==='0.00' && formMode.valor_minimo ==='0' && formMode.valor_maximo ==='0' && formMode.valor_minimo ==='0.0' && formMode.valor_maximo ==='0.0'){
        Alert.alert('No puede ingresar valores en cero dejelos vacio si no los usa.');
        return;
      } 
      handleAgregado(
        formState.nombre_parametro,
        formState.descripcion,
        formState.valor_minimo,
        formState.valor_maximo,
        formState.unidad_medida,
        formState.estado_parametro,
      );
      // Limpia los campos del formulario después de agregar
      setFormState({});
    }
    setShowForm(false); // Oculta el formulario después de guardar o cancelar
  };

  const toggleFormMode = () => {
    if (formMode === 'edit') {
      setFormMode('add');
      setFormState({}); // Limpia los campos del formulario al cambiar a modo 'add'
    }
    setShowForm(true); // Mostrar el formulario al cambiar el modo a 'add'
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => handleItemPress(item)}>
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
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    // Aquí podrías navegar a una pantalla de detalle o editar según el ítem seleccionado
    console.log('Item seleccionado:', item);
  };

  const Formulario = () => {
    useEffect(() => () => console.log("rerender form"))

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{formMode === 'edit' ? 'Editar' : 'Agregar'} Usuario</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre del Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del usuario"
              value={formState.numbre || ''}
              onChangeText={(text) => handleInputChange('numbre', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido del Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido del usuario"
              value={formState.apellido || ''}
              onChangeText={(text) => handleInputChange('apellido', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cédula del usuario</Text>
            <TextInput
              keyboardType='numeric'
              style={styles.input}
              placeholder="Cédula del usuario"
              value={formState.cedula || ''}
              onChangeText={(text) => handleInputChange('cedula', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rol del Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Rol del usuario"
              value={formState.id_rol || ''}
              onChangeText={(text) => handleInputChange('id_rol', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección del Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Dirección del usuario"
              value={formState.direccion || ''}
              onChangeText={(text) => handleInputChange('direccion', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección de e-mail del Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Dirección de e-mail del usuario"
              value={formState.correo || ''}
              onChangeText={(text) => handleInputChange('correo', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña del Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña del usuario"
              value={formState.conrasena || ''}
              onChangeText={(text) => handleInputChange('conrasena', text)}
            />
          </View>
          
          <Pressable style={styles.saveButton} onPress={handleSubmit}>
            {saving
              ?<ActivityIndicator color="#fff" />
              :<Text style={globalStyles.text}>{formMode === 'edit' ? 'Guardar' : 'Ingresar parámetros'}</Text>
            }
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => setShowForm(false)}>
            <Text style={globalStyles.text}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {showForm 
        ?<Formulario />
        :<>
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
          <Pressable style={styles.button} onPress={() => setShowForm(true)}>
            {saving
              ?<ActivityIndicator color="#fff" />
              :<Text style={globalStyles.text}><Icon name="add" size={20} color="#FFFF" /> Ingresar parámetros</Text>
            }
          </Pressable>
        </>
      }
    </View>
  );
};

export default UsuariosScreen;
