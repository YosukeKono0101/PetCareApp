import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const EditVaccinationRecordScreen = ({ route, navigation }) => {
  const { vaccinationId } = route.params;
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");

  useEffect(() => {
    const fetchVaccinationDetails = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.39:3000/care/vaccination/${vaccinationId}`
        );
        const json = await response.json();
        setVaccineName(json.vaccine_name);
        setVaccinationDate(json.vaccination_date);
      } catch (error) {
        Alert.alert("Error", "Could not load vaccination details.");
      }
    };

    fetchVaccinationDetails();
  }, [vaccinationId]);

  const handleUpdateVaccination = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.39:3000/care/vaccination/${vaccinationId}`,
        {
          method: "PUT",
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
        Alert.alert("Success", "Vaccination updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the vaccination");
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
      <Button title="Update Vaccination" onPress={handleUpdateVaccination} />
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

export default EditVaccinationRecordScreen;
