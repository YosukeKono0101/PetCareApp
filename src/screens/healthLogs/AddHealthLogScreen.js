import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const AddHealthLogScreen = ({ navigation, route }) => {
  const { petId } = route.params;
  const [logDate, setLogDate] = useState("");
  const [details, setDetails] = useState("");

  const handleAddHealthLog = async () => {
    try {
      const response = await fetch("http://192.168.1.39:3000/health-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pet_id: petId, log_date: logDate, details }),
      });
      const json = await response.json();
      if (response.status === 200) {
        Alert.alert("Success", "Health log added successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding the health log");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Log Data"
        value={logDate}
        onChangeText={setLogDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        style={styles.input}
        multiline
      />
      <Button title="Add Health Log" onPress={handleAddHealthLog} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddHealthLogScreen;
