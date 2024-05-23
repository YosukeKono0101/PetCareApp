import React, { useState, useContext } from "react";
import { Text, StyleSheet, Alert, ActivityIndicator, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import Button from "../../components/Button";
import Container from "../../components/Container";

// VaccinationDetailsScreen component
const VaccinationDetailsScreen = ({ route, navigation }) => {
  const { vaccinationId } = route.params;
  const { fontSize, theme } = useContext(SettingsContext);
  const [vaccinationDetails, setVaccinationDetails] = useState(null);
  const isDarkTheme = theme === "dark";

  // Fetch the vaccination details from the server
  useFocusEffect(
    React.useCallback(() => {
      const fetchVaccinationDetails = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const cachedDetails = await AsyncStorage.getItem(
            `vaccination-${vaccinationId}`
          );

          if (cachedDetails) {
            setVaccinationDetails(JSON.parse(cachedDetails));
          }

          const response = await fetch(
            `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch from server");
          }

          const json = await response.json();
          if (response.ok) {
            setVaccinationDetails(json.data);
            await AsyncStorage.setItem(
              `vaccination-${vaccinationId}`,
              JSON.stringify(json.data)
            );
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

  // Delete the vaccination record from the server
  const handleDeleteVaccination = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        await AsyncStorage.removeItem(`vaccination-${vaccinationId}`);
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

  // Show a loading indicator while fetching the vaccination details
  if (!vaccinationDetails) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Container isDarkTheme={isDarkTheme}>
      <View style={styles.content}>
        <Text
          style={[styles.title, { fontSize }, isDarkTheme && styles.darkText]}
        >
          Vaccination Details
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Pet: {vaccinationDetails.pet_name}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Vaccine Name: {vaccinationDetails.vaccine_name}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Vaccination Date:{" "}
          {new Date(vaccinationDetails.vaccination_date).toLocaleDateString()}
        </Text>
      </View>
      <Button
        onPress={() =>
          navigation.navigate("EditVaccinationRecord", { vaccinationId })
        }
        title="Edit Vaccination"
        color="#007bff"
      />
      <Button
        onPress={handleDeleteVaccination}
        title="Delete Vaccination"
        color="#ff4444"
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
  },
});

export default VaccinationDetailsScreen;
