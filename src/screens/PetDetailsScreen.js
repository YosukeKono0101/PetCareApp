import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const PetDetailsScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  // mock data
  const petDetails = {
    name: "Rex",
    type: "Dog",
    age: 5,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{petDetails.name}</Text>
      <Text>Type: {petDetails.type}</Text>
      <Text>Age: {petDetails.age}</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default PetDetailsScreen;
