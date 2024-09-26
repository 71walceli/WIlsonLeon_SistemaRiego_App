import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Pressable, Platform, SafeAreaView, 
  Modal, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import WebView from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import { startOfDay, endOfDay, formatISO, set } from "date-fns"
import Checkbox from 'expo-checkbox';

import { globalStyles } from './estilos/estilologin.js';
import AccordionListItem from '../components/Accordion.js';

const ReporteScreen = () => {
  const [userData, setUserData] = useState([]);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [showPDF, setShowPDF] = useState(false);
  const [fecha1texto, setfecha1] = useState('');
  const [fecha2texto, setfecha2] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(null)
  
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setfecha1(formattedDate);
      const year1 = endDate.getFullYear();
      const month1 = String(endDate.getMonth() + 1).padStart(2, '0');
      const day1 = String(endDate.getDate()).padStart(2, '0');
      const formattedDate1 = `${year1}-${month1}-${day1}`;
      setfecha2(formattedDate1);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth.php?op=consultaHistorialSensores2`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha1: fecha1texto || '',
          fecha2: fecha2texto || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const responseData = await response.json();
      let dates2 = responseData.message;
      setUserData(dates2);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowReport = () => {
    setShowPDF(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(null)
    setStartDate(startOfDay(currentDate));
  };
  
  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowDatePicker(null)
    setEndDate(endOfDay(currentDate));
  };
  
  const showDatepicker = () => {
    setShowDatePicker("startDate")
  };
  
  const showDatepicker1 = () => {
    setShowDatePicker("endDate")
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.title}>{item.nombre ? item.nombre : 'Nombre no disponible'}</Text>
      <Text style={styles.subtitle}>{item.descripcion ? item.descripcion : 'Descripción no disponible'}</Text>
      <Text style={styles.subtitle}>{item.fecha ? item.fecha : 'Fecha no disponible'}</Text>
    </TouchableOpacity>
  );

  const [filterIncluir, setFilterIncluir] = React.useState([
    "lluvia",
    "hum_r",
    "hum_s",
    "temp",
    "bomba",
    "tanque",
  ])
  const handleFilterChange = (key) => setFilterIncluir(list => {
    const keyIndex = list.indexOf(key);
    return list.includes(key) 
      ? [...list.slice(0, keyIndex), ...list.slice(keyIndex + 1)] 
      : [...list, key]
    ;
  });
  const MyCheckbox = ({value, text}) => <TouchableOpacity onPress={() => handleFilterChange(value)}
    style={{ display: "flex", flexDirection: "row", }}
  >
    <Checkbox
      value={filterIncluir.includes(value)}
      onValueChange={() => handleFilterChange(value)}
    />
    <Text>{text}</Text>
  </TouchableOpacity>
  useEffect(() => console.log({filterIncluir}), [filterIncluir])

  const parametros = `?inicio=${formatISO(startDate).substring(0, 19)}&fin=${
    formatISO(endDate).substring(0, 19)
  }&filtros=${filterIncluir.join(",")}`
  const reporteUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/reporte.php${parametros}`;
  const reporteDescargaUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/reporteDescarger.php${parametros}`;

  const [downloadPercent, setDownloadPercent] = useState(null)

  const handleDownloadReport = () => {
    if (loading) return;

    const filename = `reporte-${formatISO(new Date()).replace(":", "-")}.pdf`;
    
    setLoading(true);
    (FileSystem.createDownloadResumable(
      reporteDescargaUrl,
      FileSystem.documentDirectory + filename,
      {},
      ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        const progress = totalBytesWritten / totalBytesExpectedToWrite;
        setDownloadPercent(progress);
      }
    )).downloadAsync()
      .then(({ uri }) => {
        console.log('File downloaded successfully to:', uri);
        StorageAccessFramework.requestDirectoryPermissionsAsync().then(async ({ directoryUri, granted }) => {
          if (!granted) {
            console.error("Permission not granted, status", granted);
            return;
          }

          await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, filename, "application/pdf")
            .then(async (uriToSave) => {
              await FileSystem.writeAsStringAsync(uriToSave,
                await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }),
                { encoding: FileSystem.EncodingType.Base64 }
              );
              console.log({ uriToSave });
            })
            .catch(e => console.log(e));
          console.log({ uri });
          //await FileSystem.deleteAsync(uri);
          //console.log({uri})
        });
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        setDownloadPercent(null);
      });
    ;
  };
  return (
    <View style={styles.container}>
      <View style={{ ...styles.containerfechas, flexGrow: 0 }}>
        <Pressable style={styles.button}  onPress={showDatepicker}  >
          <Text style={globalStyles.text}><Icon name="calendar-month" size={20} color="#FFFF" /> Seleccionar fecha de inicio</Text>
        </Pressable>
        <Text>Fecha seleccionada: {fecha1texto}</Text>
        {(showDatePicker === "startDate" || Platform.OS === "ios")
          && <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleStartDateChange}
          />
        }
        <Pressable style={styles.button}  onPress={showDatepicker1}  >
          <Text style={globalStyles.text}><Icon name="calendar-month" size={20} color="#FFFF" /> Seleccionar fecha fin</Text>
        </Pressable>
        <Text>Fecha seleccionada: {fecha2texto}</Text>
        {(showDatePicker === "endDate" || Platform.OS === "ios")
          && <DateTimePicker
            testID="dateTimePicker"
            value={endDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleEndDateChange}
          />
        }
        <Pressable style={styles.button}  onPress={fetchData}  >
          {loading 
            ?<ActivityIndicator color="#fff" />
            :<Text style={globalStyles.text}><Icon name="search" size={20} color="#FFFF" /> Consultar informe</Text>
          }
        </Pressable>
      </View>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: "100%" }}>
        {userData instanceof Array
          ?<FlatList
            data={userData}
            renderItem={renderItem}
            valueExtractor={(item) => item.id.toString()}
          />
          :<Text>No existen datos</Text>
        }
      </View>
      <View style={{ flexGrow: 0, flexDirection: "column" }}>
        <AccordionListItem title="Filtros">
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 15, marginTop: 17 }}>
            <MyCheckbox text="Lluvia" value="lluvia" />
            <MyCheckbox text="Bomba" value="bomba" />
            <MyCheckbox text="Reservovio" value="tanque" />
            <MyCheckbox text="Temperatura" value="temp" />
            <MyCheckbox text="Humedad relativa" value="hum_r" />
            <MyCheckbox text="Humedad del suelo" value="hum_s" />
          </View>
        </AccordionListItem>
        <Pressable style={styles.button} onPress={handleShowReport}>
          {loading 
            ?<>
              <ActivityIndicator color="#fff" /> 
              {downloadPercent 
                && <Text style={{ color: "white", }}>{(downloadPercent * 100).toFixed(2)} %</Text>
              }
            </>
            :<Text style={globalStyles.text}><Icon name="visibility" size={20} color="#FFFF" /> Visualizar informe</Text>
          }
        </Pressable>
      </View>
      <SafeAreaView  style={{ flex: 1 }}>
        <Modal visible={showPDF} onRequestClose={() => setShowPDF(false)} transparent={true}>
          <View style={styles.pdfContainer}>
            <WebView
              originWhitelist={[process.env.EXPO_PUBLIC_API_BASE_URL]}
              source={{ uri: reporteUrl }}
              javaScriptEnabled={true}
              //domStorageEnabled={true}
              style={{ flex: 1 }}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.spacer} />
              <Pressable onPress={handleDownloadReport}
                style={{...styles.button, 
                  flexGrow: 2, 
                  flexShrink: 0, 
                  flexBasis: 1,
                  color: "white",
                  flexDirection: "row",
                }} 
              >
                {loading 
                  ?<>
                    <ActivityIndicator color="#fff" /> 
                    {downloadPercent 
                      && <Text style={{ color: "white", }}>{(downloadPercent * 100).toFixed(2)} %</Text>
                    }
                  </>
                  :<Text style={globalStyles.text}><Icon name="close" size={20} color="#FFFF" /> Descargar PDF</Text>
                }
              </Pressable>
              <Pressable onPress={() => setShowPDF(false)}
                style={{...styles.buttoncerrar, 
                  flexGrow: 1, 
                  flexShrink: 1, 
                  flexBasis: 1
                }}
              >
                <Text style={globalStyles.text}><Icon name="close" size={20} color="#FFFF" /> Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerfechas: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 15,
    marginBottom:10,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
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
    height: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    width: '90%',
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
  buttonControl: {
    width: '30%',
    height: 60,
    top: -73,
    left: 250,
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
    color: "white",
  },
  buttoncerrar: {
    width: '30%',
    height: 50,
    backgroundColor: '#F90202',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  downloadText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  buttonpdf: {
    // Estilos específicos para el primer botón
  },
  spacer: {
    width: 10,
  },
  webviewContainer: {
    flex: 1,
  },
});

export default ReporteScreen;
