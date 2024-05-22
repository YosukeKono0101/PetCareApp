import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

const EditVaccinationRecordScreen = ({ route, navigation }) => {
  const { vaccinationId } = route.params;
  const { fontSize, theme } = useContext(SettingsContext);
  const [vaccineName, setVaccineName] = useState(new Date());
  const [vaccinationDate, setVaccinationDate] = useState(new Date());
  const [petName, setPetName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const fetchVaccinationDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        setVaccineName(json.data.vaccine_name);
        setVaccinationDate(new Date(json.data.vaccination_date));
        setPetName(json.data.pet_name);
      } catch (error) {
        Alert.alert("Error", "Could not load vaccination details.");
      }
    };

    fetchVaccinationDetails();
  }, [vaccinationId]);

  const handleUpdateVaccination = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vaccine_name: vaccineName,
            vaccination_date: vaccinationDate.toISOString(),
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
    setShowDatePicker(false);
    setVaccinationDate(currentDate);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkTheme && styles.darkContainer,
      ]}
    >
      <Text
        style={[styles.title, { fontSize }, isDarkTheme && styles.darkText]}
      >
        Edit Vaccination Record
      </Text>
      <Text
        style={[styles.subtitle, { fontSize }, isDarkTheme && styles.darkText]}
      >
        Pet: {petName}
      </Text>
      <TextInput
        placeholder="Vaccine Name"
        value={vaccineName}
        onChangeText={setVaccineName}
        style={[styles.input, { fontSize }, isDarkTheme && styles.darkInput]}
        placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      />
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateButtonText, { fontSize }]}>
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
  darkContainer: {
    backgroundColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#555",
  },
  darkText: {
    color: "#fff",
  },
  darkInput: {
    borderColor: "#555",
    backgroundColor: "#444",
    color: "#fff",
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
