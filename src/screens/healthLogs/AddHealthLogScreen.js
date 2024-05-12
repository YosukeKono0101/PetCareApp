import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddHealthLogScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [logDate, setLogDate] = useState(new Date());
  const [details, setDetails] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleAddHealthLog = async () => {
    if (!selectedPetId) {
      Alert.alert("Error", "Please select a pet first.");
      return;
    }
    try {
      const response = await fetch("http://192.168.1.39:3000/health-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pet_id: selectedPetId,
          log_date: logDate.toISOString(),
          details,
        }),
      });
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
    <ScrollView contentContainerStyle={styles.container}>
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
      <Button title="Choose Log Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={logDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setLogDate(selectedDate);
            }
          }}
        />
      )}
      <TextInput
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        style={styles.input}
        multiline
        numberOfLines={4} // Makes it easier to type more text
      />
      <Button title="Add Health Log" onPress={handleAddHealthLog} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  picker: {
    marginBottom: 20,
  },
  input: {
    height: 100, // Increased height
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: "top", // Proper align for multiline
  },
});

export default AddHealthLogScreen;
