import React, { useState, useEffect, useContext } from "react";
import { Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import InputField from "../../components/InputField";
import DatePickerField from "../../components/DatePickerField";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { API_URL } from "@env";

// The EditPetScreen component is used to edit an existing pet.
const EditPetScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const { fontSize, theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  // Fetch the pet details from the server
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/pets/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        // Update the state with the pet details
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

  // Update the pet details on the server
  const handleUpdatePet = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/pets/${petId}`, {
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
      // Show a success message if the pet was updated successfully
      if (response.ok) {
        const updatedPet = {
          id: petId,
          name,
          type,
          gender,
          breed,
          age,
          weight,
          birthDate: birthDate.toISOString(),
        };
        await AsyncStorage.setItem(`pet-${petId}`, JSON.stringify(updatedPet));
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
      <Button onPress={handleUpdatePet} title="Update Pet" color="#28a745" />
    </Container>
  );
};

export default EditPetScreen;
