import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditHealthLogScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const [logDate, setLogDate] = useState(new Date());
  const [details, setDetails] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchLogDetails = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.39:3000/health-logs/${logId}`
        );
        const json = await response.json();
        if (response.ok) {
          setLogDate(new Date(json.log_date));
          setDetails(json.details);
        } else {
          Alert.alert(
            "Error",
            json.message || "Failed to fetch health log details"
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.message || "Failed to fetch health log details"
        );
      }
    };

    fetchLogDetails();
  }, [logId]);

  const handleUpdateLog = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.39:3000/health-logs/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            log_date: logDate.toISOString(),
            details,
          }),
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Health log updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Error", json.message || "Failed to update health log");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update health log");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || logDate;
    setShowDatePicker(false);
    setLogDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Health Log</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Choose Log Date: {logDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={logDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TextInput
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        style={styles.input}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateLog}>
        <Text style={styles.buttonText}>Update Health Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  dateButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditHealthLogScreen;
