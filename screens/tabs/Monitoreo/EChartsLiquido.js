import React, { useRef, useEffect, useState } from 'react';
import { View, Dimensions,Pressable,StyleSheet,Text, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../estilos/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const EChartsComponent = () => {
  const webViewRef = useRef(null);
  const [nivelLluvia, setNivelLluvia] = useState('bajo'); // Valor inicial por defecto

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (loading) 
      return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaLiquido`, {
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

      setNivelLluvia(dates.nivel.toLowerCase()); // Actualizar el nivel basado en la respuesta
      console.log('Datos obtenidos:', dates); // Mostramos los datos obtenidos por consola
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(false);
    }
  };
  const traerdatos = async () => {
    fetchData();
  };
  useEffect(() => {
    fetchData(); // Llamar a la función de inmediato
    const interval = setInterval(() => {
      fetchData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Construye el HTML basado en el estado `userData`
  const chartHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Tanque de Agua con Efecto Ola</title>
        <style>
          body {
              text-align: center;
              margin: 0;
          }
            h3{
              margin-left: -23%;
              }
            .tanque {
                position: relative;
                width: 250px;
                height: 250px;
                border-left: 4px solid black;
                border-right: 4px solid black;
                border-bottom: 4px solid black;
                background-color: white;
                overflow: hidden;
                margin: 20px;
            }

            .agua {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 0; /* Inicialmente el tanque está vacío */
                background-color: #09f; /* Color azul del agua */
                clip-path: polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%); /* Inicialmente oculto */
                transition: height 1.5s ease-in-out; /* Animación más suave para la altura */
            }

            @keyframes wave {
                0%, 100% {
                    clip-path: polygon(0% 47%, 10% 48%, 33% 54%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
                }
                50% {
                    clip-path: polygon(0% 60%, 15% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
                }
            }

            .tanque.bajo .agua {
                height: 25%;
                animation: wave 3s ease-in-out infinite; /* Activar la animación */
            }

            .tanque.medio .agua {
                height: 120%;
                animation: wave 3s ease-in-out infinite; /* Activar la animación */
            }

            .tanque.lleno .agua {
                height: 200%;
                animation: wave 3s ease-in-out infinite; /* Activar la animación */
            }

            /* Añadido para asegurar que clip-path se ajuste al nivel del agua */
            .tanque.bajo .agua,
            .tanque.medio .agua,
            .tanque.lleno .agua {
                /* Ajustar clip-path basado en la altura actual */
                clip-path: polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%); /* Asegura que clip-path cubra toda el área visible */
            }
        </style>
    </head>
    <body>
        <div class="tanque " id="tanque">
            <div class="agua" id="agua"></div>
        </div>
        <h3>Nivel ${nivelLluvia}</h3>
         <script>
         setInterval(function () {
            const tanque = document.getElementById('tanque');
            tanque.classList.remove('bajo', 'medio', 'lleno'); // Limpiar todas las clases anteriores
            tanque.classList.add('${nivelLluvia}'); // Agregar la clase del nivel deseado
            }, 500);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: chartHtml }}
        style={{ width: width, height: 320 }}
      />
      <Pressable style={styles.button} onPress={traerdatos}>
      {loading 
        ?<ActivityIndicator color="#fff" />
        :<Text style={globalStyles.text}><Icon name="sync-alt" size={20} color="#FFFF" /> Actualizar</Text>
      }
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop:10,
  },
});
export default EChartsComponent;
