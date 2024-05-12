import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const VaccinationDetailsScreen = ({ route, navigation }) => {
  const { vaccinationId } = route.params;
  const [vaccinationDetails, setVaccinationDetails] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchVaccinationDetails = async () => {
        try {
          const response = await fetch(
            `http://192.168.1.39:3000/vaccination/${vaccinationId}`
          );
          const json = await response.json();
          if (response.ok) {
            setVaccinationDetails(json);
          } else {
            throw new Error(
              json.message || "Unable to fetch vaccination details"
            );
          }
        } catch (error) {
          Alert.alert("Error", error.message);
          setVaccinationDetails(null);
        }
      };

      fetchVaccinationDetails();
    }, [vaccinationId])
  );

  const handleDeleteVaccination = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
        { method: "DELETE" }
      );
      const json = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Vaccination deleted successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        throw new Error(json.message || "Failed to delete vaccination");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (!vaccinationDetails) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vaccination Details</Text>
      <Text>Vaccine Name: {vaccinationDetails.vaccine_name}</Text>
      <Text>
        Vaccination Date:{" "}
        {new Date(vaccinationDetails.vaccination_date).toLocaleDateString()}
      </Text>
      <Button
        title="Edit"
        onPress={() =>
          navigation.navigate("EditVaccinationRecord", { vaccinationId })
        }
      />
      <Button title="Delete" onPress={handleDeleteVaccination} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default VaccinationDetailsScreen;
