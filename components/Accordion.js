import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AccordionListItem = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  //const animatedController = useRef(new Animated.Value(0)).current;
  //const [bodySectionHeight, setBodySectionHeight] = useState();

  /* const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  });

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0rad', `${Math.PI}rad`],
  }); */

  const toggleListItem = () => {
    /* if (open) {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 0,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }).start();
    } else {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 1,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }).start();
    } */
    setOpen(!open);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => toggleListItem()}>
        <View style={styles.titleContainer}>
          <Text>{title}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
          {/* <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
          </Animated.View> */}
        </View>
      </TouchableWithoutFeedback>
      <View style={{...styles.bodyContainer, display: open ? "flex" : "none", }}>
        {children}
      </View>
      {/* <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
      </Animated.View> */}
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
    //position: 'absolute',
    bottom: 0,
  },
});
