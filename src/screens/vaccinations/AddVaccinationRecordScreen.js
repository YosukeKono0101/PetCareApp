import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

const AddVaccinationRecordScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const vaccines = ["Rabies", "DHPP", "Leptospirosis", "Lyme", "Bordetella"];

  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch("http://192.168.1.39:3000/pets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        setPets(json);
        if (json.length > 0) {
          setSelectedPetId(json[0].id);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load pets");
      }
    };
    fetchPets();
  }, []);

  const handleAddVaccination = async () => {
    if (!selectedPetId || !vaccineName || !vaccinationDate || !notes) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://192.168.1.39:3000/vaccination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pet_id: selectedPetId,
          vaccine_name: vaccineName,
          vaccination_date: vaccinationDate.toISOString(),
          notes: notes,
        }),
      });
      if (response.ok) {
        Alert.alert("Success", "Vaccination added successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding the vaccination");
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vaccinationDate;
    setShowDatePicker(false);
    setVaccinationDate(currentDate);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDarkTheme ? styles.darkSafeArea : styles.lightSafeArea,
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDarkTheme && styles.darkScrollContainer,
        ]}
      >
        <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
          <Text
            style={[
              styles.header,
              { fontSize },
              isDarkTheme && styles.darkText,
            ]}
          >
            Add Vaccination Record
          </Text>
          {pets.length > 0 && (
            <RNPickerSelect
              onValueChange={(value) => setSelectedPetId(value)}
              items={pets.map((pet) => ({
                label: pet.name,
                value: pet.id,
              }))}
              placeholder={{ label: "Select a pet", value: null }}
              style={pickerSelectStyles}
            />
          )}
          <RNPickerSelect
            onValueChange={(value) => setVaccineName(value)}
            items={vaccines.map((vaccine) => ({
              label: vaccine,
              value: vaccine,
            }))}
            placeholder={{ label: "Select a vaccine", value: null }}
            style={pickerSelectStyles}
          />
          <TouchableOpacity
            style={styles.dateButton}
            onPress={showDatePickerModal}
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
          <TextInput
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            style={[
              styles.input,
              { fontSize },
              isDarkTheme && styles.darkInput,
            ]}
            multiline
            placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddVaccination}
          >
            <Text style={[styles.buttonText, { fontSize }]}>
              Add Vaccination
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  lightSafeArea: {
    backgroundColor: "#f0f0f0",
  },
  darkSafeArea: {
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  darkScrollContainer: {
    backgroundColor: "#333",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  picker: {
    marginBottom: 20,
  },
  dateButton: {
    padding: 15,
    backgroundColor: "#007bff",
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
  darkInput: {
    borderColor: "#555",
    backgroundColor: "#444",
    color: "#fff",
  },
  button: {
    padding: 15,
    backgroundColor: "#28a745",
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    marginBottom: 20,
  },
  placeholder: {
    color: "gray",
  },
});

export default AddVaccinationRecordScreen;
