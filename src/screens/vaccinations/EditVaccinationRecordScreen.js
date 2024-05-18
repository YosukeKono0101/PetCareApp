import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditVaccinationRecordScreen = ({ route, navigation }) => {
  const { vaccinationId } = route.params;
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchVaccinationDetails = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.39:3000/vaccination/${vaccinationId}`
        );
        const json = await response.json();
        setVaccineName(json.data.vaccine_name);
        setVaccinationDate(new Date(json.data.vaccination_date));
      } catch (error) {
        Alert.alert("Error", "Could not load vaccination details.");
      }
    };

    fetchVaccinationDetails();
  }, [vaccinationId]);

  const handleUpdateVaccination = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vaccine_name: vaccineName,
            vaccination_date: vaccinationDate.toISOString().split("T")[0],
          }),
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Vaccination updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the vaccination");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vaccinationDate;
    setShowDatePicker(Platform.OS === "ios");
    setVaccinationDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Vaccination Record</Text>
      <TextInput
        placeholder="Vaccine Name"
        value={vaccineName}
        onChangeText={setVaccineName}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Select Vaccination Date: {vaccinationDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={vaccinationDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleUpdateVaccination}>
        <Text style={styles.buttonText}>Update Vaccination</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
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
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditVaccinationRecordScreen;
