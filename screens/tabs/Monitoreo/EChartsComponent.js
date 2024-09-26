import React, { useRef, useEffect,useState } from 'react';
import { View, Dimensions, Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../estilos/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';


const EChartsComponent = () => {
  const webViewRef = useRef(null);
  const [humedad1, setHumedad1] = useState('20');
  const [humedad2, setHumedad2] = useState('20');

  const [loading, setLoading] = useState(0);

  const fetchHumedad1 = async () => {
    if (loading) 
      return;

    try {
      setLoading(l => l + 1);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaHumedad1`, {
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
      setHumedad1(dates.porcentaje);
      console.log('Datos obtenidos:', dates); // Mostramos los datos obtenidos por consola
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(l => l - 1);
    }
  };
  const fetchHumedad2 = async () => {
    try {
      setLoading(l => l + 1);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaHumedad2`, {
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
      setHumedad2(dates.porcentaje);
      console.log('Datos obtenidos:', dates); // Mostramos los datos obtenidos por consola
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(l => l - 1);
    }
  };

  const traerdatos = async () => {
    fetchHumedad1();
    fetchHumedad2();
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHumedad1();
      fetchHumedad2();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '50%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          distance: -30,
          length: 10,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          distance: -25,
          length: 14,
          lineStyle: {
            color: '#fff',
            width: 3
          }
        },
        axisLabel: {
          color: 'inherit',
          distance: -10,
          fontSize: 15
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} °C',
          lineHeight: 40,
          fontWeight: 'bolder',
          borderRadius: 8,
          color: 'inherit',
          width: '30%',
          fontSize: 30,
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  };

  const chartHtml = `
    <!DOCTYPE html>
    <html style="height: 100%; width:100%;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>ECharts</title>
      <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
    </head>
    <body style="height: 75%; margin: 0">
      <h2>Sensor 1</h2>
      <div id="main" style="height: 60%;width:100%; margin-bottom: -70px;"></div>
      <h2>Sensor 2</h2>
      <div id="main1" style="height: 60%;width:100%; margin-bottom: -100px;"></div>
      <script type="text/javascript">
        var chart1 = echarts.init(document.getElementById('main1'),null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        var chart = echarts.init(document.getElementById('main'),null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
        var options = ${JSON.stringify(chartOptions)};
        setInterval(function () {
            chart.setOption({
              series: [
                {
                  data: [
                    {
                      value: ${humedad1}
                    }
                  ]
                },
                {
                  data: [
                    {
                      value: ${humedad1}
                    }
                  ]
                }
              ]
            });
            chart1.setOption({
              series: [
                {
                  data: [
                    {
                      value: ${humedad2}
                    }
                  ]
                },
                {
                  data: [
                    {
                      value: ${humedad2}
                    }
                  ]
                }
              ]
            });
          }, 500);
        chart.setOption(options);
        chart1.setOption(options);
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
        style={{ width:300,   }}
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
