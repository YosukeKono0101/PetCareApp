import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Picker } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const [fontSize, setFontSize] = useState("medium");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedFontSize = await AsyncStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Font Size:</Text>
      <Picker
        selectedValue={fontSize}
        onValueChange={(itemValue, itemIndex) => setFontSize(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Small" value="small" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="Large" value="large" />
      </Picker>
      <Button title="Save Settings" onPress={saveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  picker: {
    width: "100%",
    marginBottom: 20,
  },
});

export default SettingsScreen;
