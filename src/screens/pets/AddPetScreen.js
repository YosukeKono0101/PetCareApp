import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const AddPetScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleAddPet = async () => {
    try {
      const response = await fetch("http://192.168.1.39:3000/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type }),
      });
      const json = await response.json();
      if (response.status === 200) {
        Alert.alert("Success", "Pet added successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding the pet");
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
      <Button title="Add Pet" onPress={handleAddPet} />
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

export default AddPetScreen;
