import React, { useState } from 'react';
import { Image, View, Text, TextInput, Pressable, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from './estilos/estilologin.js'; // Asegúrate de que globalStyles esté correctamente definido
import { ActivityIndicator } from 'react-native';

const LoginScreen = ({ navigation, onAuthSuccess }) => {
  const [email, setEmail] = useState('');//juan.perez@example.com
  const [password, setPassword] = useState('');//Juan123*
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const saveData = async (datos) => {
    try {
      // Crear un objeto para almacenar los datos limpios
      const cleanData = {};
  
      // Iterar sobre cada propiedad en datos y limpiarla
      Object.keys(datos).forEach(key => {
        cleanData[key] = datos[key] !== null && datos[key] !== undefined ? datos[key] : '';
      });
  
      await AsyncStorage.setItem('@userData:key', JSON.stringify(cleanData));
      console.log('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  const handleLogin = async () => {
    if (loading) 
      return;

    // Aquí puedes colocar la lógica de validación y autenticación
    if (!email || !password) { // Validación básica de campos
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    
    try {
      setLoading(true)
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request Timeout'));
        }, 60000); // 60 segundos
      });

      console.log(process.env.EXPO_PUBLIC_API_BASE_URL)
      const apiPromise = fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=autenticacion`,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(`Código: ${response.status}\n${json.message || response.errorMessage}`);
      } else {
        json.message.contrasena = password;
        await saveData(json.message);
       
        ToastAndroid.showWithGravity(
          'Bienvenido al sistema',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        onAuthSuccess();
      }
    } catch (error) {
      Alert.alert(`Error: ${error.message.split("\n")[1]}`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <LinearGradient
      colors={['#FFE000', '#799F0C', '#00416A']}
      style={globalStyles.container}
    >
      <Image source={require('../assets/cacao.png')} style={[globalStyles.image, globalStyles.upperLeft]} />
      <Image source={require('../assets/cacao.png')} style={[globalStyles.image, globalStyles.lowerRight]} />

      <View style={globalStyles.logoContainer}>
        <Image source={require('../assets/regandoplantas.png')} style={globalStyles.logo} />
      </View>
      <Text style={globalStyles.title}>Iniciar sesión</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#FEFEFC"
        value={email}
        onChangeText={setEmail}
      />
      <View style={globalStyles.passwordContainer}>
        <TextInput
          style={globalStyles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="#FEFEFC"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
          <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="#FEFEFC" style={globalStyles.eyeIcon} />
        </TouchableOpacity>
      </View>
      <Pressable style={globalStyles.button} onPress={handleLogin}>
        {loading 
          ?<ActivityIndicator color="#fff" />
          :<Text style={globalStyles.text}>Iniciar sesión</Text>
        }
      </Pressable>
      <Text style={globalStyles.textRecuperar} onPress={() => navigation.navigate('Correo')}>¿Has olvidado tu contraseña?</Text>
      <Text style={globalStyles.textRegistro1}>¿No tienes cuenta? <Text style={globalStyles.textRegistro} onPress={() => navigation.navigate('Register')}>Regístrate aquí</Text></Text>
    </LinearGradient>
  );
};

export default LoginScreen;
