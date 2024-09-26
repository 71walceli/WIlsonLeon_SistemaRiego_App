import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient'; // Importa el gradiente lineal de Expo
import { globalStyles } from './estilos/estilologin.js'; // Importa los estilos globales
import { validarvacios, handleCedulaChange, validatePassword, validateEmail } from '../validaciones/validarinputs.js';

const RegisterScreen = ({ navigation, onAuthSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async ({ navigation }) => {
    if (loading) return;
    const fields = { nombre, apellido, cedula, email, password };

    if (!validarvacios(fields)) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    if (cedulaError) {
      Alert.alert('Error', cedulaError);
      return;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request Timeout'));
      }, 60000); // 60 segundos
    });

    try {
      setLoading(true);
      const responsePromise = fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=registroemple`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          cedula,
          email,
          password,
        }),
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);
      const contentType = response.headers.get('content-type');
      let responseData = {};
      responseData = await response.json();
      if (!response.ok) {
        const errorMessage = responseData.message ? `: ${responseData.message}` : '';
        throw new Error(` ${response.status}${errorMessage}`);
      }else{
        Alert.alert(responseData.message);
        handleBack();
      }
    } catch (error) {
      console.log('Error completo:', error);
      Alert.alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigation.goBack();
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
      <Text style={globalStyles.title}>Registro de usuario</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Nombre"
        placeholderTextColor="#FEFEFC"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Apellido"
        placeholderTextColor="#FEFEFC"
        value={apellido}
        onChangeText={setApellido}
      />
      
      <TextInput
        style={globalStyles.input}
        placeholder="Cédula"
        placeholderTextColor="#FEFEFC"
        value={cedula}
        onChangeText={(text) => handleCedulaChange(text, setCedula, setCedulaError)}
        keyboardType="numeric"
      />
      { cedula ? (
        cedulaError ? (
          <Text style={globalStyles.error}>{cedulaError}</Text>
        ) :
          <Text style={globalStyles.success}>✅ Cédula válida</Text>
        ) : null}
      <TextInput
        style={globalStyles.input}
        placeholder="Correo"
        placeholderTextColor="#FEFEFC"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(validateEmail(text));
        }}
      />
      {email ? (
        emailError ? (
          <Text style={globalStyles.error}>{emailError}</Text>
        ) : (
          <Text style={globalStyles.success}>✅ Correo electrónico válido</Text>
        )
      ) : null}
      <View style={globalStyles.passwordContainer}>
        <TextInput
          style={globalStyles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="#FEFEFC"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(validatePassword(text));
          }}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="#FEFEFC" style={globalStyles.eyeIcon}/>
        </TouchableOpacity>
      </View>
      {password ? (
        passwordError ? (
          <Text style={globalStyles.error}>{passwordError}</Text>
        ) : (
          <Text style={globalStyles.success}>✅ Contraseña válida</Text>
        )
      ) : null}
      <Pressable style={globalStyles.button} onPress={handleRegister}>
        {loading 
          ?<ActivityIndicator color="#fff" />
          :<Text style={globalStyles.text}>Guardar</Text>
        }
      </Pressable>
      <Pressable style={globalStyles.backButtonregistro} onPress={handleBack}>
        <Icon name="arrow-back" size={24} color="white" />
        <Text style={globalStyles.text}>Regresar </Text>
      </Pressable>
    </LinearGradient>
  );
};

export default RegisterScreen;
