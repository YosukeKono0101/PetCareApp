import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

const EditPetScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { fontSize, theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        if (json) {
          setName(json.name);
          setType(json.type);
          setGender(json.gender);
          setBreed(json.breed);
          setAge(json.age);
          setWeight(json.weight);
          setBirthDate(new Date(json.birthDate));
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "An error occurred while fetching the pet details"
        );
      }
    };

    fetchPetDetails();
  }, [petId]);

  const handleUpdatePet = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          type,
          gender,
          breed,
          age,
          weight,
          birthDate: birthDate.toISOString(),
        }),
      });
      if (response.ok) {
        Alert.alert("Success", "Pet updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the pet");
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === "ios");
    setBirthDate(currentDate);
  };

  return (
    <ScrollView style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <Text
        style={[styles.header, { fontSize }, isDarkTheme && styles.darkText]}
      >
        Edit Pet Details
      </Text>
      <TextInput
        placeholder="Pet Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, isDarkTheme && styles.darkInput]}
        placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      />
      <TextInput
        placeholder="Type (e.g., Dog, Cat)"
        value={type}
        onChangeText={setType}
        style={[styles.input, isDarkTheme && styles.darkInput]}
        placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      />
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={[styles.input, isDarkTheme && styles.darkInput]}
        placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      />
      <TextInput
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
        style={[styles.input, isDarkTheme && styles.darkInput]}
        placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        style={[styles.input, isDarkTheme && styles.darkInput]}
        keyboardType="numeric"
        placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        style={[styles.input, isDarkTheme && styles.darkInput]}
        keyboardType="numeric"
        placeholderTextColor={isDarkTheme ? "#ccc" : "#aaa"}
      />
      <TouchableOpacity onPress={showDatePickerModal} style={styles.dateButton}>
        <Text style={[styles.dateButtonText, { fontSize }]}>
          Select Birth Date: {birthDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleUpdatePet}>
        <Text style={[styles.buttonText, { fontSize }]}>Update Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  darkInput: {
    borderColor: "#555",
    backgroundColor: "#444",
    color: "#fff",
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

export default EditPetScreen;
