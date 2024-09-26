// Original from https://snack.expo.dev/@bgpiggin/accordion-list
import React, { useState, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AccordionListItem = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  
  const toggleListItem = () => setOpen(!open);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => toggleListItem()}>
        <View style={styles.titleContainer}>
          <Text>{title}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
        </View>
      </TouchableWithoutFeedback>
      <View style={{...styles.bodyContainer, display: open ? "flex" : "none", }}>
        {children}
      </View>
    </View>
  );
};
export default AccordionListItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
    margin: 8,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 8,
  },
  bodyBackground: {
    backgroundColor: '#EFEFEF',
    overflow: 'hidden',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    paddingLeft: '1.5rem',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
  },
  bodyContainer: {
    padding: '1rem',
    paddingLeft: '1.5rem',
    bottom: 0,
  },
});
