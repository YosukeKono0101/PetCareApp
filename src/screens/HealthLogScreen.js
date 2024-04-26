// src/screens/HealthLogScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";

const HealthLogScreen = () => {
  const [healthLog, setHealthLog] = useState("");

  const handleSaveLog = () => {
    console.log("Saving health log:", healthLog);
    // Write the process to call the API here to save the health log to the database
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health Log</Text>
      <TextInput
        placeholder="Enter health details"
        value={healthLog}
        onChangeText={setHealthLog}
        multiline
        style={[styles.input, { height: 100 }]}
      />
      <Button title="Save Log" onPress={handleSaveLog} />
    </ScrollView>
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default HealthLogScreen;
