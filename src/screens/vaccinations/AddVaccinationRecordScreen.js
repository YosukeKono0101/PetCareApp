import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddVaccinationRecordScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const vaccines = ["Rabies", "DHPP", "Leptospirosis", "Lyme", "Bordetella"];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://192.168.1.39:3000/pets");
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
    if (!selectedPetId) {
      Alert.alert("Error", "Please select a pet first.");
      return;
    }
    try {
      const response = await fetch("http://192.168.1.39:3000/vaccination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pet_id: selectedPetId,
          vaccine_name: vaccineName,
          vaccination_date: vaccinationDate.toISOString().split("T")[0],
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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || vaccinationDate;
    setShowDatePicker(Platform.OS === "ios");
    setVaccinationDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {pets.length > 0 && (
        <Picker
          selectedValue={selectedPetId}
          onValueChange={(itemValue) => setSelectedPetId(itemValue)}
          style={styles.picker}
        >
          {pets.map((pet) => (
            <Picker.Item label={pet.name} value={pet.id} key={pet.id} />
          ))}
        </Picker>
      )}
      <Picker
        selectedValue={vaccineName}
        onValueChange={(itemValue) => setVaccineName(itemValue)}
        style={styles.picker}
      >
        {vaccines.map((vaccine) => (
          <Picker.Item key={vaccine} label={vaccine} value={vaccine} />
        ))}
      </Picker>
      <Button
        title="Choose Vaccination Date"
        onPress={() => setShowDatePicker(true)}
      />
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
        style={styles.input}
        multiline
      />
      <Button title="Add Vaccination" onPress={handleAddVaccination} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    height: 150,
    width: "100%",
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddVaccinationRecordScreen;
