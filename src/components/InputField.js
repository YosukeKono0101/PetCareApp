import React from "react";
import { TextInput, StyleSheet } from "react-native";

// InputField component
const InputField = ({
  value,
  onChangeText,
  placeholder,
  isDarkTheme,
  fontSize,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  height = 50,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.input,
        isDarkTheme && styles.darkInput,
        { fontSize, height: multiline ? height : 50 },
      ]}
      placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  darkInput: {
    borderColor: "#555",
    backgroundColor: "#444",
    color: "#fff",
  },
});

export default InputField;
