import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";

const PetDetailsScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [petDetails, setPetDetails] = useState({
    imageUrl: "",
    name: "",
    type: "",
    age: "",
    gender: "",
    healthStatus: "",
  });

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`);
        const json = await response.json();
        if (response.ok) {
          setPetDetails({
            imageUrl: json.imageUrl,
            name: json.name,
            type: json.type,
            age: json.age,
            gender: json.gender,
            healthStatus: json.healthStatus,
          });
        } else {
          throw new Error(json.message || "Unable to fetch data");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchPetDetails();
  }, [petId]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: petDetails.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{petDetails.name}</Text>
      <Text>Type: {petDetails.type}</Text>
      <Text>Age: {petDetails.age}</Text>
      <Text>Gender: {petDetails.gender}</Text>
      <Text>Health Status: {petDetails.healthStatus}</Text>
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditPet", { petId })}
      />
      <Button title="Delete" onPress={() => console.log("Delete Pet")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default PetDetailsScreen;
