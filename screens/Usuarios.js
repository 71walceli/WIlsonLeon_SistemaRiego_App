import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, FlatList, Text, TouchableOpacity,Pressable, ActivityIndicator, ScrollView,
  TextInput, Alert, ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

import { globalStyles } from './estilos/estilologin.js'; 
import { styles } from '../styles/forms.js';
import { validateCedula, validateEmail, validatePassword } from '../validaciones/validarinputs.js';


const Formulario = ({ formState, formMode, handleInputChange, handleSubmit, saving, handleClose, handleDelete }) => {
  useEffect(() => () => console.log("rerender form"))

  const formErrors = {
    nombre: useMemo(
      () => [null, undefined, ""].includes(formState.nombre) ? "Requerido" : null,
      [formState.nombre]
    ),
    apellido: useMemo(
      () => [null, undefined, ""].includes(formState.apellido) ? "Requerido" : null,
      [formState.apellido]
    ),
    email: useMemo(
      () => ![null, undefined, ""].includes(formState.email) ? validateEmail(formState.email) : "Requerido",
      [formState.email]
    ),
    cedula: useMemo(
      () => ![null, undefined, ""].includes(formState.cedula) ? validateCedula(formState.cedula) : "Requerido",
      [formState.cedula]
    ),
    password: useMemo(
      () => ![null, undefined, ""].includes(formState.password) 
        ? validatePassword(formState.password) 
        : formMode === "edit" ? null : "Requerido"
      ,
      [formState.password]
    ),
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{formMode === 'edit' ? 'Editar' : 'Agregar'} Usuario</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre del Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del usuario"
            value={formState.nombre || ''}
            onChangeText={(text) => handleInputChange('nombre', text)}
          />
          {formErrors.nombre 
            && <Text style={globalStyles.error}>{formErrors.nombre}</Text>
          }
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido del Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Apellido del usuario"
            value={formState.apellido || ''}
            onChangeText={(text) => handleInputChange('apellido', text)}
          />
          {formErrors.apellido 
            && <Text style={globalStyles.error}>{formErrors.apellido}</Text>
          }
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
          {formErrors.cedula 
            && <Text style={globalStyles.error}>{formErrors.correo}</Text>
          }
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rol del Usuario</Text>
          <Picker
            selectedValue={formState.id_rol}
            onValueChange={(itemValue) => handleInputChange("id_rol", itemValue)}
          >
            <Picker.Item label="Jornalero" value={1} />
            <Picker.Item label="Administrador" value={2} />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección de e-mail del Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección de e-mail del usuario"
            value={formState.email || ''}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          {formErrors.correo 
            && <Text style={globalStyles.error}>{formErrors.correo}</Text>
          }
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña del Usuario</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            keyboardType='pass'
            placeholder={formMode === "edit" ? "Contraseña actual del usuario" : "Contraseña del usuario"}
            value={formState.password || ''}
            onChangeText={(text) => handleInputChange('password', text)}
          />
          {formErrors.password
            && <Text style={globalStyles.error}>{formErrors.password}</Text>
          }
        </View>
        
        <Pressable style={styles.saveButton} onPress={() => {
          if (Object.values(formErrors).find(v => v !== null)) {
            Alert.alert('Todos los campos deben estar validados');
            return;
          }
          handleSubmit();
        }}>
          {saving
            ?<ActivityIndicator color="#fff" />
            :<Text style={globalStyles.text}>{formMode === 'edit' ? 'Guardar' : 'Ingresar'}</Text>
          }
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={handleClose}>
          <Text style={globalStyles.text}>Cancelar</Text>
        </Pressable>
        {/* {formMode === "edit" 
          &&<Pressable style={styles.cancelButton} onPress={handleDelete}>
            <Text style={globalStyles.text}>Eliminar Usuarior</Text>
          </Pressable>
        } */}
      </View>
    </ScrollView>
  );
};

const UsuariosScreen = () => {
  const [userData, setUserData] = useState({});
  const [formState, setFormState] = useState({}); // Estado para almacenar el estado del formulario
  const [formMode, setFormMode] = useState('add'); // Estado para controlar el modo del formulario (edit o add)
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

  useEffect(() => { fetchData(); }, []);

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

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=${
        formMode === "edit"
          ?"EditarUsuario"
          :"registroemple"
      }`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        let responseData = {};
        responseData = await response.json();  
        console.error(responseData.message); 
        throw new Error(`HTTP error ${response.status}`); 
      }
      ToastAndroid.showWithGravity('Parámetro editado con éxito', 
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      handleRefresh(); // Actualizar la lista después de editar el parámetro
      setShowForm(false); // Ocultar el formulario después de editar el parámetro
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error(formState)
      // Manejo del error
    } finally {
      setSaving(false);
    }
  };

  // Función para manejar el cambio en los campos del formulario
  const handleInputChange = (fieldName, value) => {
    setFormState({ ...formState, [fieldName]: value });
  };

  const handleSubmit = () => {
    handleSave();
    setShowForm(false); // Oculta el formulario después de guardar o cancelar
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
    setFormMode("edit");
    setShowForm(true)
    setFormState({ ...item, email: item.correo, id_rol: Number(item.id_rol) });
    console.log('Item seleccionado:', item);
  };

  return (
    <View style={styles.container}>
      {showForm 
        ?<Formulario 
          formState={formState} 
          formMode={formMode} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit} 
          handleClose={() => {
            setShowForm(false);
            setFormState({});
          }}
          handleDelete={() => {
            // TODO
          }}
          saving={saving}
        />
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
          <Pressable style={styles.button} onPress={() => {
            setShowForm(true);
            setFormMode("add");
            setFormState({})
          }}>
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
