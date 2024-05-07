import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const PetDetailsScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [petDetails, setPetDetails] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPetDetails = async () => {
        try {
          const response = await fetch(
            `http://192.168.1.39:3000/pets/${petId}`
          );
          const json = await response.json();
          if (response.ok) {
            setPetDetails({
              ...json,
              gender: json.gender || "Not available",
              breed: json.breed || "Not available",
              age: json.age || "Not available",
              weight: json.weight ? `${json.weight} kg` : "Not available",
              birthDate: json.birthDate || "Not available",
            });
          } else {
            throw new Error(json.message || "Unable to fetch data");
          }
        } catch (error) {
          Alert.alert("Error", error.message);
          setPetDetails(null);
        }
      };

      fetchPetDetails();
    }, [petId])
  );

  const handleDeletePet = async () => {
    try {
      const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Pet deleted successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        throw new Error(json.message || "Failed to delete pet");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (!petDetails) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/pet_icon.jpeg")}
        style={styles.image}
      />
      <Text style={styles.title}>{petDetails.name}</Text>
      <Text>Type: {petDetails.type}</Text>
      <Text>Gender: {petDetails.gender}</Text>
      <Text>Breed: {petDetails.breed}</Text>
      <Text>Age: {petDetails.age}</Text>
      <Text>Weight: {petDetails.weight}</Text>
      <Text>Birth Date: {petDetails.birthDate}</Text>
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditPet", { petId })}
      />
      <Button title="Delete" onPress={handleDeletePet} />
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
