import React, { useState, useEffect, useContext } from "react";
import { Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { SettingsContext } from "../../context/SettingsContext";
import InputField from "../../components/InputField";
import DatePickerField from "../../components/DatePickerField";
import Button from "../../components/Button";
import Container from "../../components/Container";

// Add vaccination record screen
const AddVaccinationRecordScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const vaccines = ["Rabies", "DHPP", "Leptospirosis", "Lyme", "Bordetella"];
  const isDarkTheme = theme === "dark";

  // Fetch the list of pets from the server
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const cachedPets = await AsyncStorage.getItem("pets");

        if (cachedPets) {
          setPets(JSON.parse(cachedPets));
        }

        const response = await fetch("http://192.168.1.39:3000/pets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch from server");
        }

        const json = await response.json();
        setPets(json);
        await AsyncStorage.setItem("pets", JSON.stringify(json));
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

  return (
    <Container isDarkTheme={isDarkTheme}>
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
      <DatePickerField
        date={vaccinationDate}
        setDate={setVaccinationDate}
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <InputField
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
        multiline
        height={100} // customized height
      />
      <Button
        onPress={handleAddVaccination}
        title="Add Vaccination"
        color="#28a745"
      />
    </Container>
  );
};

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
