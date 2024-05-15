import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
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
          <Text style={styles.vaccinationDetail}>
            {vaccination.vaccine_name} -{" "}
            {new Date(vaccination.vaccination_date).toLocaleDateString()}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="View Details"
              onPress={() =>
                navigation.navigate("VaccinationDetails", {
                  vaccinationId: vaccination.id,
                })
              }
            />
          </View>
        </View>
      ))}
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Vaccination"
          onPress={() => navigation.navigate("AddVaccinationRecord")}
        />
      </View>
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
  vaccinationCard: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vaccinationDetail: {
    flex: 1,
    marginLeft: 20,
    fontSize: 18,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  addButtonContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default VaccinationScheduleScreen;
