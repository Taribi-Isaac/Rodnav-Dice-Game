import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';

const PrimaryButton = ({ onPress, backgroundColor, textColor, text, disabled }) => {
  const buttonBackgroundColor = disabled ? '#d3d3d3' : (backgroundColor || '#007bff');
  const buttonTextColor = disabled ? '#a9a9a9' : (textColor || '#ffffff');

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, { backgroundColor: buttonBackgroundColor }]}>
      <Text style={[styles.text, { color: buttonTextColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  button: {
    width: screenWidth * 0.92, // 80% of the screen width
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    alignSelf: 'center'
  },
  text: {
    fontSize: 14,
  },
});
