import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";

const VaccinationScheduleScreen = ({ navigation }) => {
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await fetch(
          "http://192.168.1.39:3000/care/vaccination"
        );
        const json = await response.json();
        setVaccinations(json);
      } catch (error) {
        console.error("Failed to fetch vaccinations", error);
      }
    };

    fetchVaccinations();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={vaccinations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>
              {item.vaccine_name} -{" "}
              {new Date(item.vaccination_date).toDateString()}
            </Text>
            <Button
              title="Edit"
              onPress={() =>
                navigation.navigate("EditVaccinationRecord", {
                  vaccinationId: item.id,
                })
              }
            />
            <Button
              title="Delete"
              onPress={() => handleDeleteVaccination(item.id)}
            />
          </View>
        )}
      />
    </View>
  );

  async function handleDeleteVaccination(id) {
    const response = await fetch(
      `http://192.168.1.39:3000/care/vaccination/${id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      setVaccinations((prev) =>
        prev.filter((vaccination) => vaccination.id !== id)
      );
      alert("Vaccination deleted successfully");
    } else {
      alert("Failed to delete vaccination");
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
});

export default VaccinationScheduleScreen;
