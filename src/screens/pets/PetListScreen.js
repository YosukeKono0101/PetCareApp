import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

const PetListScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const response = await fetch("http://192.168.1.39:3000/pets");
      const json = await response.json();
      setPets(json);
    };

    fetchPets();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>
              {item.name} ({item.type})
            </Text>
            <Button
              title="Edit"
              onPress={() => navigation.navigate("EditPet", { petId: item.id })}
            />
            <Button title="Delete" onPress={() => handleDeletePet(item.id)} />
          </View>
        )}
      />
    </View>
  );

  async function handleDeletePet(id) {
    const response = await fetch(`http://192.168.1.39:3000/pets/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
      Alert.alert("Success", "Pet deleted successfully");
    } else {
      Alert.alert("Error", "Failed to delete the pet");
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
});

export default PetListScreen;
