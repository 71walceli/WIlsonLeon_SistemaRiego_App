import React, { useState, useEffect } from 'react';
import { ScrollView, View, FlatList, StyleSheet, Text, TouchableOpacity, Pressable, TextInput, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from './estilos/estilologin.js';

const ParametrosScreen = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [selectedParametro, setSelectedParametro] = useState(null); // Estado para almacenar el parámetro seleccionado
  const [formState, setFormState] = useState({}); // Estado para almacenar el estado del formulario
  const [formMode, setFormMode] = useState('edit'); // Estado para controlar el modo del formulario (edit o add)
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (loading) return;

    try {
      setLoading(true);
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

  const handleAgregado = async (nombre_parametro, descripcion, valor_minimo, valor_maximo, unidad_medida, estado_parametro) => {
    if (saving) return;
    try {
      setSaving(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=IngresarParametro`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_parametro: nombre_parametro || '',
          descripcion: descripcion || '',
          valor_minimo: valor_minimo || '0.00',
          valor_maximo: valor_maximo || '0.00',
          unidad_medida: unidad_medida || '',
          estado_parametro: estado_parametro || '',
        }),
      });

      if (!response.ok) {
        let responseData = {};
        responseData = await response.json();
        const errorMessage = responseData.message ? `: ${responseData.message}` : '';
        console.log(errorMessage);
        throw new Error(`HTTP error ${response.status}`);
      }
      ToastAndroid.showWithGravity(
        'Parámetro guardado con éxito',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      handleRefresh(); // Actualizar la lista después de agregar el parámetro
      setShowForm(false); // Ocultar el formulario después de agregar el parámetro
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setSaving(false);
    }
  };

  const handleEditado = async (nombre_parametro, descripcion, valor_minimo, valor_maximo, unidad_medida, estado_parametro, id) => {
    if (saving) return;
    try {
      setSaving(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=EditarParametro`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_parametro: nombre_parametro || '',
          descripcion: descripcion || '',
          valor_minimo: valor_minimo || '0.00',
          valor_maximo: valor_maximo || '0.00',
          unidad_medida: unidad_medida || '',
          estado_parametro: estado_parametro || '',
          id,
        }),
      });

      if (!response.ok) {
        let responseData = {};
        responseData = await response.json();  
        console.log(responseData.message); 
        throw new Error(`HTTP error ${response.status}`); 
      }
      ToastAndroid.showWithGravity(
        'Parámetro editado con éxito',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      handleRefresh(); // Actualizar la lista después de editar el parámetro
      setShowForm(false); // Ocultar el formulario después de editar el parámetro
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setSaving(false);
    }
  };

  // Función para manejar el click en un ítem de la lista
  const handleItemPress = (item) => {
    setSelectedParametro(item); // Almacena el parámetro seleccionado en el estado
    setFormMode('edit'); // Cambia el modo del formulario a 'edit'
    setFormState({
      id: item.id, // Captura el id del parámetro seleccionado
      nombre_parametro: item.nombre_parametro,
      descripcion: item.descripcion,
      valor_minimo: item.valor_minimo,
      valor_maximo: item.valor_maximo,
      unidad_medida: item.unidad_medida,
      estado_parametro: item.estado_parametro,
    });
    setShowForm(true); // Mostrar el formulario al seleccionar un parámetro
  };

  // Función para manejar el cambio en los campos del formulario
  const handleInputChange = (fieldName, value) => {
    setFormState({ ...formState, [fieldName]: value });
  };

  // Función para guardar los cambios en el formulario
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
    setSelectedParametro(null); // Limpia el parámetro seleccionado
  };

  // Función para cambiar el modo del formulario entre 'edit' y 'add'
  const toggleFormMode = () => {
    if (formMode === 'edit') {
      setFormMode('add');
      setFormState({}); // Limpia los campos del formulario al cambiar a modo 'add'
    }
    setShowForm(true); // Mostrar el formulario al cambiar el modo a 'add'
  };

  // Renderizar cada ítem de la lista
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => handleItemPress(item)}>
      <Text style={styles.title}>{item.nombre_parametro}</Text>
      <Text style={styles.subtitle}>{item.descripcion}</Text>
      {item.valor_minimo !== null && item.valor_minimo!=='' && item.valor_minimo!=='0.00' ?<Text style={styles.subtitle}>{'Valor Mínimo:' +item.valor_minimo}</Text>:''}
      {item.valor_maximo !== null && item.valor_maximo!=='' && item.valor_maximo!=='0.00' ?<Text style={styles.subtitle}>{'Valor Máximo:' +item.valor_maximo}</Text>:''}
      {item.unidad_medida !== null && item.unidad_medida!=='' ?<Text style={styles.subtitle}>{'Unidad de Medida:' +item.unidad_medida}</Text>:''}
      {item.estado_parametro!== null && item.estado_parametro!== ''?<Text style={styles.subtitle}>{'Estados:'+ item.estado_parametro}</Text>:''}
    </TouchableOpacity>
  );

  // Renderizar el formulario si hay un parámetro seleccionado o está en modo 'add'
  const renderFormulario = () => {
    if (!showForm) {
      return null;
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{formMode === 'edit' ? 'Editar Parámetro' : 'Agregar Parámetro'}</Text>

        {/* Nombre del Parámetro */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre del Parámetro</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Parámetro"
            value={formState.nombre_parametro || ''}
            onChangeText={(text) => handleInputChange('nombre_parametro', text)}
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={formState.descripcion || ''}
            onChangeText={(text) => handleInputChange('descripcion', text)}
          />
        </View>

        
        {formMode === 'edit' ? (
          formState.valor_maximo !== null && formState.valor_maximo !== '' && formState.valor_maximo!=='0.00' ? (
            <>
            {/* Valor Mínimo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor Mínimo</Text>
              <TextInput
                keyboardType='decimal-pad'
                style={styles.input}
                placeholder="Valor Mínimo"
                value={formState.valor_minimo || ''}
                onChangeText={(text) => handleInputChange('valor_minimo', text)}
              />
            </View>
            {/* Valor Máximo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor Máximo</Text>
              <TextInput
                keyboardType='decimal-pad'
                style={styles.input}
                placeholder="Valor Máximo"
                value={formState.valor_maximo || ''}
                onChangeText={(text) => handleInputChange('valor_maximo', text)}
              />
            </View>

            {/* Unidad de Medida */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Unidad de Medida</Text>
              <TextInput
                style={styles.input}
                placeholder="Unidad de Medida"
                value={formState.unidad_medida || ''}
                onChangeText={(text) => handleInputChange('unidad_medida', text)}
              />
            </View>
            {formState.estado_parametro !== null && formState.estado_parametro !== '' ?
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado del parámetro</Text>
              <TextInput
                style={styles.input}
                placeholder="Estado del parámetro"
                value={formState.estado_parametro || ''}
                onChangeText={(text) => handleInputChange('estado_parametro', text)}
              />
            </View>
            :''}
            </>
          ) : (
            <>
              {/* Estado del parámetro */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Estado del parámetro</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Estado del parámetro"
                  value={formState.estado_parametro || ''}
                  onChangeText={(text) => handleInputChange('estado_parametro', text)}
                />
              </View>
            </>
          )
        ) : (
          <>
            {/* Modo No Edit */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor Mínimo</Text>
              <TextInput
                keyboardType='decimal-pad'
                style={styles.input}
                placeholder="Valor Mínimo"
                value={formState.valor_minimo || ''}
                onChangeText={(text) => handleInputChange('valor_minimo', text)}
              />
            </View>
            {/* Valor Máximo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor Máximo</Text>
              <TextInput
                keyboardType='decimal-pad'
                style={styles.input}
                placeholder="Valor Máximo"
                value={formState.valor_maximo || ''}
                onChangeText={(text) => handleInputChange('valor_maximo', text)}
              />
            </View>

            {/* Unidad de Medida */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Unidad de Medida</Text>
              <TextInput
                style={styles.input}
                placeholder="Unidad de Medida"
                value={formState.unidad_medida || ''}
                onChangeText={(text) => handleInputChange('unidad_medida', text)}
              />
            </View>
            {/* Estado del parámetro */}
            {/* <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado del parámetro</Text>
              <TextInput
                style={styles.input}
                placeholder="Estado del parámetro"
                value={formState.estado_parametro || ''}
                onChangeText={(text) => handleInputChange('estado_parametro', text)}
              />
            </View> */}
          </>
        )}
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
      {!showForm && (
        <>
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
          <Pressable style={styles.button} onPress={toggleFormMode}>
          {saving
            ?<ActivityIndicator color="#fff" />
            :<Text style={globalStyles.text}><Icon name="add" size={20} color="#FFFF" /> Ingresar parámetros</Text>
          }
          </Pressable>
        </>
      )}
      {showForm && renderFormulario()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
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
  activo: {
    color: 'green',
    fontWeight: 'bold',
  },
  inactivo: {
    color: 'red',
    fontWeight: 'bold',
  },
  activobtn: {
    color: '#EAF10B',
    fontWeight: 'bold',
  },
  inactivobtn: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonControl: {
    width: '25%',
    height: 40,
    left: 240,
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
    marginBottom: 10,
  },
  formContainer: {
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
  formTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ParametrosScreen;
