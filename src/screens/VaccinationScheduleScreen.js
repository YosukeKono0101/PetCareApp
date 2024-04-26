import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";

const VaccinationScheduleScreen = () => {
  const [newVaccine, setNewVaccine] = useState("");
  const [date, setDate] = useState("");

  const handleAddVaccine = () => {
    console.log("Adding vaccine:", newVaccine, "on", date);
    // Write the process to call the API here to add new vaccinations to the database
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vaccination Schedule</Text>
      <TextInput
        placeholder="Vaccine Name"
        value={newVaccine}
        onChangeText={setNewVaccine}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (yyyy-mm-dd)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button title="Add Vaccine" onPress={handleAddVaccine} />
      {/* ここに予防接種リストを表示 */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default VaccinationScheduleScreen;
