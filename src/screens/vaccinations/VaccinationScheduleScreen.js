import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const VaccinationScheduleScreen = ({ navigation }) => {
  const [vaccinations, setVaccinations] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchVaccinations = async () => {
        try {
          const response = await fetch("http://192.168.1.39:3000/vaccination");
          const json = await response.json();
          setVaccinations(json);
        } catch (error) {
          console.error("Failed to fetch vaccinations", error);
        }
      };

      fetchVaccinations();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vaccination Schedule</Text>
      {vaccinations.map((vaccination) => (
        <View key={vaccination.id} style={styles.vaccinationCard}>
          <Image
            source={require("../../../assets/vaccination.png")}
            style={styles.image}
          />
          <View style={styles.vaccinationDetails}>
            <Text style={styles.vaccinationName}>
              {vaccination.vaccine_name}
            </Text>
            <Text style={styles.vaccinationDate}>
              {new Date(vaccination.vaccination_date).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate("VaccinationDetails", {
                  vaccinationId: vaccination.id,
                })
              }
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddVaccinationRecord")}
      >
        <Text style={styles.addButtonText}>Add New Vaccination</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  vaccinationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  vaccinationDetails: {
    flex: 1,
    marginLeft: 15,
  },
  vaccinationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  vaccinationDate: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 30,
  },
  detailsButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VaccinationScheduleScreen;
