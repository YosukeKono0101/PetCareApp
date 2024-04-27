import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const EditPetScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`);
        const json = await response.json();
        setName(json.name);
        setType(json.type);
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
        body: JSON.stringify({ name, type }),
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
    <View style={styles.container}>
      <TextInput
        placeholder="Pet Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Pet Type (e.g., Dog, Cat)"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <Button title="Update Pet" onPress={handleUpdatePet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
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
