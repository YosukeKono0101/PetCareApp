import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";

const HomeScreen = ({ navigation }) => {
  // mock data
  const pets = [
    { id: 1, name: "Rex", type: "Dog" },
    { id: 2, name: "Whiskers", type: "Cat" },
  ];

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
