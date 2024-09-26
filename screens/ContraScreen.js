import React, { useState } from 'react';
import { Image, View, Text, TextInput, Pressable, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa el paquete de íconos
import { validarvacios,validatePassword} from '../validaciones/validarinputs';
import { globalStyles } from './estilos/estilologin.js';
import { LinearGradient } from 'expo-linear-gradient';

const ContraScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para controlar la visibilidad de la contraseña

  const [loading, setLoading] = useState(false);

  const handleContra = async () =>{
    if (loading) return;

    const fields = { password };

    if (!validarvacios(fields)) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
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
      const responsePromise = fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=contra`, {
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
  
      const response = await Promise.race([responsePromise, timeoutPromise]);
      const contentType = response.headers.get('content-type');
  
      let responseData = {};
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        throw new Error('Respuesta no es JSON');
      }
  
      if (!response.ok) {
        const errorMessage = responseData.message ? ` ${responseData.message}` : '';
        throw new Error(`Error: ${response.status}${errorMessage}`);
      }
      console.log(responseData);
      Alert.alert(responseData.message);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error completo:', error);
      Alert.alert(error.message);
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
      <Text style={globalStyles.title}>Digite su nueva contraseña aquí</Text>
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
          <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="#FEFEFC" style={globalStyles.eyeIcon} />
        </TouchableOpacity>
      </View>
       {passwordError ? <Text style={globalStyles.error}>{passwordError}</Text> : null}
      
      <Pressable style={globalStyles.button} onPress={handleContra}>
        {loading 
          ?<ActivityIndicator color="#fff" />
          :<Text style={globalStyles.text}>Cambiar contraseña</Text>
        }
      </Pressable>
      <Pressable style={globalStyles.backButtonregistro} onPress={handleBack}>
        <Icon name="arrow-back" size={24} color="white" />
        <Text style={globalStyles.text}>Regresar </Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginBottom:12,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'left',
  },
});

export default ContraScreen;
