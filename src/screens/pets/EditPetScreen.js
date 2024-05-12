import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditPetScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`);
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
      const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Pet Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Type (e.g., Dog, Cat)"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />
      <TextInput
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        keyboardType="numeric"
      />
      <DateTimePicker
        value={birthDate}
        mode="date"
        display="default"
        onChange={(event, selectedDate) =>
          setBirthDate(selectedDate || birthDate)
        }
      />
      <Button title="Update Pet" onPress={handleUpdatePet} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditPetScreen;
