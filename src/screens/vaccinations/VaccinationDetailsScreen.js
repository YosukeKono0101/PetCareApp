import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
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
            setVaccinationDetails(json.data);
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
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vaccination Details</Text>
      <Text style={styles.detailText}>
        Vaccine Name: {vaccinationDetails.vaccine_name}
      </Text>
      <Text style={styles.detailText}>
        Vaccination Date:{" "}
        {new Date(vaccinationDetails.vaccination_date).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("EditVaccinationRecord", { vaccinationId })
        }
      >
        <Text style={styles.buttonText}>Edit Vaccination</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDeleteVaccination}
      >
        <Text style={styles.buttonText}>Delete Vaccination</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default VaccinationDetailsScreen;
