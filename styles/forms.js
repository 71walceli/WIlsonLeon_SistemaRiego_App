import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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