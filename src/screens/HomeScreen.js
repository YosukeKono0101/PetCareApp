import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://192.168.1.39:3000/pets");
        const json = await response.json();
        console.log("Fetched pets:", json);
        if (Array.isArray(json)) {
          setPets(json);
        } else {
          console.error("Fetched data is not an array:", json);
          setPets([]);
        }
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Pets</Text>
      {pets.map((pet) => (
        <View key={pet.id} style={styles.petCard}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text>{pet.type}</Text>
          <Button
            title="View Details"
            onPress={() => navigation.navigate("PetDetails", { petId: pet.id })}
          />
        </View>
      ))}
      <Button
        title="Add New Pet"
        onPress={() => navigation.navigate("AddPet")}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  petCard: {
    padding: 20,
    marginVertical: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
