// styles.js

import { center } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100, // ajusta según el tamaño deseado
    height: 100, // ajusta según el tamaño deseado
    resizeMode: 'contain',
    position: 'absolute',
  },
  upperLeft: {
    top: 20,
    left: 0,
  },
  lowerRight: {
    bottom: 0,
    right: 0,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 150, // ajusta según el tamaño deseado
    height: 150, // ajusta según el tamaño deseado
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FEFEFC',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#FEFEFC',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    color: '#FEFEFC',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  text: {
    color: '#FEFEFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textRecuperar: {
    marginTop: 10,
    color: '#FEFEFC',
    fontSize: 16,
  },
  textRegistro1: {
    marginTop: 20,
    color: '#FEFEFC',
    fontSize: 16,
  },
  textRegistro: {
    color: '#4CAF50',
    fontSize: 16,
  },
  error: {
    backgroundColor: '#000000', // Color de fondo rojo con opacidad del 10%
    color: '#F00F0F', // Color del texto del error
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 10,
    paddingHorizontal: 10, // Espacio horizontal dentro del contenedor del texto de error
    paddingVertical: 5, // Espacio vertical dentro del contenedor del texto de error
    textAlign: 'left',
    fontWeight: 'bold',
  },
  success: {
    backgroundColor: '#000000', // Color de fondo verde
    color: '#00FF00', // Color del texto blanco
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'left',
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
  backButtonregistro: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    textAlign: 'center',
    top: 50,
    left: 5
  },
});
