import React, { useState, useEffect, useContext } from "react";
import { Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { SettingsContext } from "../../context/SettingsContext";
import InputField from "../../components/InputField";
import DatePickerField from "../../components/DatePickerField";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { API_URL } from "@env";

const AddHealthLogScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [logDate, setLogDate] = useState(new Date());
  const [details, setDetails] = useState("");
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const fetchPets = async () => {
      // Fetch the list of pets from the server
      try {
        const token = await AsyncStorage.getItem("token");
        const cachedPets = await AsyncStorage.getItem("pets");

        if (cachedPets) {
          setPets(JSON.parse(cachedPets));
          if (JSON.parse(cachedPets).length > 0) {
            setSelectedPetId(JSON.parse(cachedPets)[0].id);
          }
        }

        const response = await fetch(`${API_URL}/pets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        setPets(json); // Store the list of pets in the state
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

  const handleAddHealthLog = async () => {
    // Validate the selected pet and the details
    if (!selectedPetId || !details) {
      Alert.alert("Error", "Please select a pet and fill in the details.");
      return;
    }
    // Add the health log to the server
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/health-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pet_id: selectedPetId,
          log_date: logDate.toISOString(),
          details,
        }),
      });
      // Check the response status
      if (response.status === 200) {
        Alert.alert("Success", "Health log added successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Error", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding the health log");
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
      <DatePickerField
        date={logDate}
        setDate={setLogDate}
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <InputField
        value={details}
        onChangeText={setDetails}
        placeholder="Details"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
        multiline
        numberOfLines={4}
        height={100}
      />
      <Button
        onPress={handleAddHealthLog}
        title="Add Health Log"
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

export default AddHealthLogScreen;
