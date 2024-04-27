import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const EditHealthLogScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const [logDate, setLogDate] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const fetchHealthLogDetails = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.39:3000/health-logs/${logId}`
        );
        const json = await response.json();
        setLogDate(json.log_date);
        setDetails(json.details);
      } catch (error) {
        Alert.alert(
          "Error",
          "An error occurred while fetching the health log details"
        );
      }
    };

    fetchHealthLogDetails();
  }, [logId]);

  const handleUpdateHealthLog = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.39:3000/health-logs/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ log_date: logDate, details }),
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Health log updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the health log");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Log Date"
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
      <Button title="Update Health Log" onPress={handleUpdateHealthLog} />
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

export default EditHealthLogScreen;
