import React, { useState, useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import InputField from "../../components/InputField";
import DatePickerField from "../../components/DatePickerField";
import Button from "../../components/Button";
import Container from "../../components/Container";

// Add a new pet
const AddPetScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const { fontSize, theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  // Handle the add pet button press
  const handleAddPet = async () => {
    if (!name || !type || !gender || !breed || !age || !weight) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    // Create a new pet object with the form data
    const petData = {
      name,
      type,
      gender,
      breed,
      age,
      weight,
      birthDate: birthDate.toISOString(),
    };

    // Send a POST request to the server to add the new pet
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
      // Show a success message if the pet was added successfully
      if (response.status === 200) {
        // Update cached pets
        const cachedPets = await AsyncStorage.getItem("pets");
        const pets = cachedPets ? JSON.parse(cachedPets) : [];
        pets.push(json);
        await AsyncStorage.setItem("pets", JSON.stringify(pets));

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

  return (
    <Container isDarkTheme={isDarkTheme}>
      <InputField
        value={name}
        onChangeText={setName}
        placeholder="Pet Name"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <InputField
        value={type}
        onChangeText={setType}
        placeholder="Type (e.g., Dog, Cat)"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <InputField
        value={gender}
        onChangeText={setGender}
        placeholder="Gender"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <InputField
        value={breed}
        onChangeText={setBreed}
        placeholder="Breed"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <InputField
        value={age}
        onChangeText={setAge}
        placeholder="Age"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
        keyboardType="numeric"
      />
      <InputField
        value={weight}
        onChangeText={setWeight}
        placeholder="Weight (kg)"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
        keyboardType="numeric"
      />
      <DatePickerField
        date={birthDate}
        setDate={setBirthDate}
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <Button onPress={handleAddPet} title="Add Pet" color="#28a745" />
    </Container>
  );
};

export default AddPetScreen;
