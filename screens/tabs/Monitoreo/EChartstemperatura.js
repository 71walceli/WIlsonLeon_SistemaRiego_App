import React, { useRef, useEffect,useState } from 'react';
import { View, Dimensions,Pressable,StyleSheet,Text, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../estilos/styles';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');


const EChartsComponent = () => {
  const webViewRef = useRef(null);
  const [userData, setUserData] = useState('20');
  const [userData1, setUserData1] = useState('20');

  const [loading, setLoading] = useState(0);

  const fetchData = async () => {
    if (loading)
      return;

    try {
      setLoading(v => v + 1);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaTemperatura`, {
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
      setUserData(dates.temperatura);
      console.log('Datos obtenidos:', dates); // Mostramos los datos obtenidos por consola
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(v => v - 1);
    }
  };
  const fetchData1 = async () => {
    if (loading) 
      return;

    try {
      setLoading(v => v + 1);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaHumedadR`, {
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
      setUserData1(dates.humedad);
      console.log('Datos obtenidos:', dates); // Mostramos los datos obtenidos por consola
    } catch (error) {
      console.error('Error fetching data:', error);
      // Manejo del error
    } finally {
      setLoading(v => v - 1);
    }
  };
  const traerdatos = async () => {
    fetchData();
    fetchData1();
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      fetchData1();
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
  const chartOptions1 = {
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
          formatter: '{value} %',
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
      <h2>Sensor de Temperatura</h2>
      <div id="main" style="height: 60%;width:100%; margin-bottom: -70px;"></div>
      <h2>Sensor de Humedad Relativa</h2>
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
        var options1 = ${JSON.stringify(chartOptions1)};
        setInterval(function () {
            chart.setOption({
              series: [
                {
                  data: [
                    {
                      value: ${userData}
                    }
                  ]
                },
                {
                  data: [
                    {
                      value: ${userData}
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
                      value: ${userData1}
                    }
                  ]
                },
                {
                  data: [
                    {
                      value: ${userData1}
                    }
                  ]
                }
              ]
            });
          }, 500);
        chart.setOption(options);
        chart1.setOption(options1);
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
        style={{ width:300,  }}
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

