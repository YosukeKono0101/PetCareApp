import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const AddVaccinationRecordScreen = ({ navigation }) => {
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");

  const handleAddVaccination = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.39:3000/care/vaccination",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vaccine_name: vaccineName,
            vaccination_date: vaccinationDate,
          }),
        }
      );
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
    <View style={styles.container}>
      <TextInput
        placeholder="Vaccine Name"
        value={vaccineName}
        onChangeText={setVaccineName}
        style={styles.input}
      />
      <TextInput
        placeholder="Vaccination Date"
        value={vaccinationDate}
        onChangeText={setVaccinationDate}
        style={styles.input}
      />
      <Button title="Add Vaccination" onPress={handleAddVaccination} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddVaccinationRecordScreen;
