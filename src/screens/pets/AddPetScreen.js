import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

const AddPetScreen = ({ navigation }) => {
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

  const handleAddPet = async () => {
    const petData = {
      name,
      type,
      gender,
      breed,
      age,
      weight,
      birthDate: birthDate.toISOString(),
    };
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://192.168.1.39:3000/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(petData),
      });
      const json = await response.json();
      if (response.status === 200) {
        Alert.alert("Success", "Pet added successfully", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert("Error", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding the pet");
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
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
          {/* <Text
            style={[
              styles.header,
              { fontSize },
              isDarkTheme && styles.darkText,
            ]}
          >
            Add New Pet
          </Text> */}
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
          <TouchableOpacity
            onPress={showDatePickerModal}
            style={styles.dateButton}
          >
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
          <TouchableOpacity style={styles.button} onPress={handleAddPet}>
            <Text style={[styles.buttonText, { fontSize }]}>Add Pet</Text>
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
    backgroundColor: "#000",
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

export default AddPetScreen;
